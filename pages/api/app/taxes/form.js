
import { withSession } from '@/lib/Session';
import { defaultErrorHandler } from '@/lib/ErrorHandler';
import { slsFetch } from "@/components/Util";

export default withSession(handler);

async function handler(req, res) {
    try {
        const pdfRes = await slsFetch("https://www.bir.gov.ph/images/bir_files/taxpayers_service_programs_and_monitoring_1/2307%20Jan%202018%20ENCS%20v3.pdf");
        const data = await pdfRes.buffer();

        res.status(200).send(data);
    } catch(err) {
        await defaultErrorHandler(err, req, res);
    }
}