/**
 * MIT License

Copyright (c) 2022 KlaudSol Philippines, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**/

import Entity from "@/backend/models/core/Entity";
import EntityType from "@/backend/models/core/EntityType";
import { withSession } from "@klaudsol/commons/lib/Session";
import { defaultErrorHandler } from "@klaudsol/commons/lib/ErrorHandler";
import { OK, NOT_FOUND } from "@klaudsol/commons/lib/HttpStatuses";
import { resolveValue } from "@/components/EntityAttributeValue";
import { setCORSHeaders, handleRequests } from "@klaudsol/commons/lib/API";
import { createHash } from "@/lib/Hash";
import { addFilesToBucket, generateEntries, generatePresignedUrls } from "@/backend/data_access/S3";
import { transformQuery, sortData } from "@/components/Util";
import { assert, assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { filterData } from '@/components/Util';
import { readContents, writeContents } from '@/lib/Constants';
import { Redis } from "@upstash/redis";

export default withSession(handleRequests({ get, post }));

async function get(req, res) {
    await assertUserCan(readContents, req);

    const {
        entity_type_slug,
        entry,
        page,
        sort: sortValue,
        drafts,
        ...queries
    } = req.query;

    const rawData = await Entity.where(
        { entity_type_slug, entry, page, drafts },
        queries,
    );
    const rawEntityType = await EntityType.find({ slug: entity_type_slug });
    if (rawEntityType.length === 0) return res.status(NOT_FOUND).json({});

    const isSingleType = (rawEntityType[0].entity_type_variant === 'singleton');

    const initialFormat = {
        indexedData: {},
    };

    const dataTemp = rawData.data.reduce((collection, item) => {
        return {
            indexedData: {
                ...collection.indexedData,
                [item.id]: {
                    ...collection.indexedData[item.id],
                    ...(!collection.indexedData[item.id]?.id && { id: item.id }),
                    ...(!collection.indexedData[item.id]?.slug && {
                        slug: item.entities_slug,
                    }),
                    ...(!collection.indexedData[item.id]?.status && {
                        status: item.entities_status,
                    }),
                    ...({
                        [item.attributes_name]: resolveValue(item) ?? null,
                    }),
                },
            },
        };
    }, initialFormat);

    const initialMetadata = {
        attributes: {},
    };

    const metadata = rawEntityType.reduce((collection, item) => {
        return {
            attributes: {
                ...collection.attributes,
                ...(!collection.attributes[item.attribute_name] &&
                    item.attribute_name && {
                    [item.attribute_name]: {
                        type: item.attribute_type,
                        order: item.attribute_order,
                        ...(item?.attribute_custom_name && { custom_name: item.attribute_custom_name })
                    },
                }),
            },
            entity_type_id: item.entity_type_id,
            variant: item.entity_type_variant,
            total_rows: rawData.total_rows,
        };
    }, initialMetadata);

    let data;
    if (sortValue) data = sortData(dataTemp.indexedData, sortValue);

    const output = {
        data: isSingleType ? Object.values(dataTemp.indexedData)[0] : data ? { ...data } : dataTemp.indexedData,
        metadata: metadata,
    };

    output.metadata.hash = createHash(output);

    //Let's rock!

    const organization = 'mci';

    const redis = new Redis({
      url: process.env.KS_REDIS_URL,
      token: process.env.KS_REDIS_TOKEN,
    })


    const promises = Object.entries(dataTemp.indexedData).map(async ([key, value]) => {
      console.log(value.slug);
      const slug = value.slug;
      const newData = Object.entries(value).reduce((collector, [fieldKey, fieldValue]) => {

        if(fieldKey == 'id') {
          
          //if(value.order) {
          //  return collector;
          //} else {
            //use ID as order
            return {
              ...collector,
              ['order']: fieldValue
            }          
          //}
          

        } else if(fieldKey == 'slug') {

          return {
            ...collector,
            ['id']: fieldValue
          }

        } else {

          return {
            ...collector,
            [fieldKey]: fieldValue
          }

        }


      }, {}); 

      const hsetParams = Object.entries(newData).reduce((collector, [fieldKey, fieldValue]) => {
        if(typeof fieldValue === 'string' || fieldValue instanceof String) {

          //console.log(`${fieldKey} => "${fieldValue.replace(/"/g, '\\"')}"`);
          return {
            ...collector, 
            [fieldKey]: fieldValue
          };

        } else if (typeof fieldValue === 'number') {

          //console.log(`${fieldKey} => ${fieldValue}`);
          return {...collector, 
            [fieldKey]: `${fieldValue}`
          };

        } else {

          //console.log(`${fieldKey} => "${JSON.stringify(fieldValue).replace(/"/g, '\\"')}"`);
          //redis.hset does the object to JSON conversion. Amazing.
          return {
            ...collector, 
            [fieldKey]: fieldValue
          };
        }
        
      }, {});

      console.log("-----");


      const lpos = await redis.lpos(`${organization}/${entity_type_slug}`, slug);
      if(lpos == null) {
        await redis.lpush(`${organization}/${entity_type_slug}`, slug);
        console.log(`${slug} successfully addded to ${organization}/${entity_type_slug}.`);
      } else {
        console.log(`${organization}/${entity_type_slug} already contains ${slug}.`);
      }

      const hset = `hset ${organization}/${entity_type_slug}/${value.slug} ${Object.entries(hsetParams).map(([key, value]) => `${key} ${value}`).join(" ")}`;
      
      //Use only when deletingg dirty data due to coding errors.
      //Otherewise, hset can handle it.
      //await redis.del(`${organization}/${entity_type_slug}/${value.slug}`);

      //redis.hset does the object to JSON conversion. Amazing.
      await redis.hset(`${organization}/${entity_type_slug}/${value.slug}`, hsetParams);

      //console.log(hset);
      console.log("-----");

    });

    await Promise.all(promises);


    

    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

    rawData ? res.status(OK).json(output ?? []) : res.status(NOT_FOUND).json({});
}

async function post(req, res) {
    await assertUserCan(writeContents, req);

    const { fileNames = [], ...entry } = req.body;
    await Entity.create(entry);

    const presignedUrls = fileNames.length > 0 && await generatePresignedUrls(fileNames);

    res.status(OK).json({ message: 'Successfully created a new entry', presignedUrls })
}
