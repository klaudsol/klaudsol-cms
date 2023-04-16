import { withSession } from '@klaudsol/commons/lib/Session';
import {
    generateResource,
    addFileToBucket,
    generatePresignedUrls,
    deleteFilesFromBucket
}
    from "@/backend/data_access/S3";
import { resourceValueTypes } from "@/components/cmsTypes";
import { setCORSHeaders, handleRequests } from '@klaudsol/commons/lib/API';
import { OK, NOT_FOUND, BAD_REQUEST } from "@klaudsol/commons/lib/HttpStatuses";
import Setting from '@/backend/models/core/Setting';
import { assert, assertUserCan } from '@klaudsol/commons/lib/Permissions';
import { formatImageResource, resolveResource } from "@/components/Util";
import { createHash } from "@/lib/Hash";
import { readSettings, writeSettings } from '@/lib/Constants';
import { TYPES_REGEX } from '@/components/renderers/validation/TypesRegex';

export default withSession(handleRequests({ get, put, post }));

async function get(req, res) {
    // await assertUserCan(readSettings, req);

    const settingsRaw = await Setting.get();
    const settings = settingsRaw.map((setting) => {
        if (TYPES_REGEX.IMAGE.test(setting.value)) {
            const value = formatImageResource(setting.value);

            return { ...setting, value }
        }

        return setting;
    });

    const output = {
        data: settings,
        metadata: {},
    };

    output.metadata.hash = createHash(output);
    setCORSHeaders({ response: res, url: process.env.FRONTEND_URL });

    settings.length
        ? res.status(OK).json(output)
        : res.status(NOT_FOUND).json({});
}

async function post(req, res) {
    (await assertUserCan(readSettings, req)) &&
        (await assertUserCan(writeSettings, req));

    const { fileNames } = req.body;
    await Setting.update({ key: 'mainlogo', value: fileNames[0].key });

    const presignedUrls = fileNames.length > 0 && await generatePresignedUrls(fileNames);

    const newValues = {
        key: fileNames[0].key,
        link: `${process.env.KS_S3_BASE_URL}/${fileNames[0].key}`,
        name: 'mainlogo'
    }

    res.status(OK).json({ message: 'Successfully updated the logo', newValues, presignedUrls })
}

async function put(req, res) {
    (await assertUserCan(readSettings, req)) &&
        (await assertUserCan(writeSettings, req));

    const { fileNames, toDelete } = req.body;

    await Setting.update({ key: 'mainlogo', value: fileNames[0].key });

    if (toDelete.length > 0) deleteFilesFromBucket(toDelete);
    const presignedUrls = fileNames.length > 0 && await generatePresignedUrls(fileNames);

    const newValues = {
        key: fileNames[0].key,
        link: `${process.env.KS_S3_BASE_URL}/${fileNames[0].key}`,
        name: 'mainlogo'
    }

    res.status(OK).json({ message: 'Successfully updated the logo', newValues, presignedUrls })
}
