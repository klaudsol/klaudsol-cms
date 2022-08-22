import { rgb } from "pdf-lib";

// Correction factor for floating point operations
const CORRECTION_FACTOR = 1000000;

export const drawPeriod = (pdfDoc, font, startDate, endDate) => {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    const { startDay, startMonth, startYear } = {
        startDay: ("0" + startDate.getDate()).slice(-2),
        startMonth: ("0" + (startDate.getMonth() + 1)).slice(-2),
        startYear: startDate.getFullYear().toString(),
    };

    const { endDay, endMonth, endYear } = {
        endDay: ("0" + endDate.getDate()).slice(-2),
        endMonth: ("0" + (endDate.getMonth() + 1)).slice(-2),
        endYear: endDate.getFullYear().toString(),
    };
    
    firstPage.drawText(startMonth[0], {
        x: 155,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(startMonth[1], {
        x: 168,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(startDay[0], {
        x: 182,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(startDay[1], {
        x: 195,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(startYear[0], {
        x: 208,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(startYear[1], {
        x: 221,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(startYear[2], {
        x: 234,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(startYear[3], {
        x: 247,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(endMonth[0], {
        x: 403,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(endMonth[1], {
        x: 416,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(endDay[0], {
        x: 430,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(endDay[1], {
        x: 443,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(endYear[0], {
        x: 456,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(endYear[1], {
        x: 469,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(endYear[2], {
        x: 482,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(endYear[3], {
        x: 495,
        y: height / 2 + 350,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });
};

export const drawPayeeInformation = (pdfDoc, font, payeeInformation) => {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    const { tin, name, regAddress, zipCode, foreignAddress } = payeeInformation;

    firstPage.drawText(tin[0][0] || '', {
        x: 210,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[0][1] || '', {
        x: 223,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[0][2] || '', {
        x: 236,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[1][0] || '', {
        x: 262,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[1][1] || '', {
        x: 275,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[1][2] || '', {
        x: 288,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[2][0] || '', {
        x: 314,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[2][1] || '', {
        x: 327,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[2][2] || '', {
        x: 340,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[3][0] || '', {
        x: 366,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[3][1] || '', {
        x: 381,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[3][2] || '', {
        x: 396,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[3][3] || '', {
        x: 411,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[3][4] || '', {
        x: 426,
        y: height / 2 + 319,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(name || '', {
        x: 40,
        y: height / 2 + 292,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(regAddress || '', {
        x: 40,
        y: height / 2 + 264,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(zipCode[0] || '', {
        x: 545,
        y: height / 2 + 264,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(zipCode[1] || '', {
        x: 558,
        y: height / 2 + 264,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(zipCode[2] || '', {
        x: 571,
        y: height / 2 + 264,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(zipCode[3] || '', {
        x: 583,
        y: height / 2 + 264,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(foreignAddress || '', {
        x: 40,
        y: height / 2 + 236,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    }); 
};

export const drawPayorInformation = (pdfDoc, font, payorInformation) => {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    const { tin, name, regAddress, zipCode } = payorInformation;

    firstPage.drawText(tin[0][0] || '', {
        x: 210,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[0][1] || '', {
        x: 223,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[0][2] || '', {
        x: 236,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[1][0] || '', {
        x: 262,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[1][1] || '', {
        x: 275,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[1][2] || '', {
        x: 288,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[2][0] || '', {
        x: 314,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[2][1] || '', {
        x: 327,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[2][2] || '', {
        x: 340,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[3][0] || '', {
        x: 366,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[3][1] || '', {
        x: 381,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[3][2] || '', {
        x: 396,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[3][3] || '', {
        x: 411,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(tin[3][4] || '', {
        x: 426,
        y: height / 2 + 204,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(name || '', {
        x: 40,
        y: height / 2 + 177,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(regAddress || '', {
        x: 40,
        y: height / 2 + 148,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(zipCode[0] || '', {
        x: 545,
        y: height / 2 + 148,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(zipCode[1] || '', {
        x: 558,
        y: height / 2 + 148,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(zipCode[2] || '', {
        x: 571,
        y: height / 2 + 148,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(zipCode[3] || '', {
        x: 583,
        y: height / 2 + 148,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });
};

export const drawIncomePayments = (pdfDoc, font, incomePayments) => {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    let firstMonthSum = 0;
    let secondMonthSum = 0;
    let thirdMonthSum = 0;
    let summativeTotal = 0;
    let taxWithheldTotal = 0;

    let y = height / 2 + 93;

    incomePayments.rows.forEach( (row) => {
        firstPage.drawText(row['income_payments'] || '', {
            x: 25,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        firstPage.drawText(row['atc'] || '', {
            x: 180,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        firstPage.drawText(row['first_month'] || '', {
            x: 223,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        firstPage.drawText(row['second_month'] || '', {
            x: 296,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        firstPage.drawText(row['third_month'] || '', {
            x: 370,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        const { totalFirstMonth, totalSecondMonth, totalThirdMonth } = {
            totalFirstMonth: parseFloat(row['first_month']) * CORRECTION_FACTOR || 0,
            totalSecondMonth: parseFloat(row['second_month']) * CORRECTION_FACTOR || 0,
            totalThirdMonth: parseFloat(row['third_month']) * CORRECTION_FACTOR || 0
        };

        const total = (totalFirstMonth + totalSecondMonth + totalThirdMonth) / CORRECTION_FACTOR;

        firstMonthSum += totalFirstMonth;
        secondMonthSum += totalSecondMonth;
        thirdMonthSum += totalThirdMonth;
        summativeTotal += total * CORRECTION_FACTOR;

        firstPage.drawText(total.toString(), {
            x: 444,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        firstPage.drawText(row['tax_withheld'] || '', {
            x: 516,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        taxWithheldTotal += parseFloat(row['tax_withheld']) * CORRECTION_FACTOR || 0;

        y = y - 13.6;
    });

    firstMonthSum = firstMonthSum / CORRECTION_FACTOR;
    secondMonthSum = secondMonthSum / CORRECTION_FACTOR;
    thirdMonthSum = thirdMonthSum / CORRECTION_FACTOR;
    summativeTotal = summativeTotal / CORRECTION_FACTOR;
    taxWithheldTotal = taxWithheldTotal / CORRECTION_FACTOR;

    firstPage.drawText(firstMonthSum.toString(), {
        x: 223,
        y: 424,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(secondMonthSum.toString(), {
        x: 296,
        y: 424,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(thirdMonthSum.toString(), {
        x: 370,
        y: 424,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(summativeTotal.toString(), {
        x: 444,
        y: 424,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(taxWithheldTotal.toString(), {
        x: 516,
        y: 424,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });
};

export const drawMoneyPayments = (pdfDoc, font, moneyPayments) => {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    let firstMonthSum = 0;
    let secondMonthSum = 0;
    let thirdMonthSum = 0;
    let summativeTotal = 0;
    let taxWithheldTotal = 0;

    let y = height / 2 - 77;

    moneyPayments.rows.forEach( (row) => {
        firstPage.drawText(row['income_payments'] || '', {
            x: 25,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        firstPage.drawText(row['atc'] || '', {
            x: 180,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        firstPage.drawText(row['first_month'] || '', {
            x: 223,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        firstPage.drawText(row['second_month'] || '', {
            x: 296,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        firstPage.drawText(row['third_month'] || '', {
            x: 370,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        const { totalFirstMonth, totalSecondMonth, totalThirdMonth } = {
            totalFirstMonth: parseFloat(row['first_month']) * CORRECTION_FACTOR || 0,
            totalSecondMonth: parseFloat(row['second_month']) * CORRECTION_FACTOR || 0,
            totalThirdMonth: parseFloat(row['third_month']) * CORRECTION_FACTOR || 0
        };

        const total = (totalFirstMonth + totalSecondMonth + totalThirdMonth) / CORRECTION_FACTOR;

        firstMonthSum += totalFirstMonth;
        secondMonthSum += totalSecondMonth;
        thirdMonthSum += totalThirdMonth;
        summativeTotal += total * CORRECTION_FACTOR;

        firstPage.drawText(total.toString(), {
            x: 444,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        firstPage.drawText(row['tax_withheld'] || '', {
            x: 516,
            y: y,
            size: 9,
            font,
            color: rgb(0, 0, 0)
        });

        taxWithheldTotal += parseFloat(row['tax_withheld']) * CORRECTION_FACTOR || 0;

        y = y - 13.6;
    });

    firstMonthSum = firstMonthSum / CORRECTION_FACTOR;
    secondMonthSum = secondMonthSum / CORRECTION_FACTOR;
    thirdMonthSum = thirdMonthSum / CORRECTION_FACTOR;
    summativeTotal = summativeTotal / CORRECTION_FACTOR;
    taxWithheldTotal = taxWithheldTotal / CORRECTION_FACTOR;

    firstPage.drawText(firstMonthSum.toString(), {
        x: 223,
        y: 255,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(secondMonthSum.toString(), {
        x: 296,
        y: 255,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(thirdMonthSum.toString(), {
        x: 370,
        y: 255,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(summativeTotal.toString(), {
        x: 444,
        y: 255,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(taxWithheldTotal.toString(), {
        x: 516,
        y: 255,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });
};

export const drawPayeeSignatories = async (pdfDoc, font, payeeInformation) => {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    const payeeSignatureBlob = payeeInformation.signature && await payeeInformation.signature.arrayBuffer();
    const payeeSignatory = payeeSignatureBlob && await pdfDoc.embedPng(payeeSignatureBlob);

    if(payeeSignatory) firstPage.drawImage(payeeSignatory, {
        x: width / 2 - 25,
        y: 120,
        width: 100,
        height: 25, 
    });

    firstPage.drawText(payeeInformation.name, {
        x: width / 2 - 50,
        y: 112,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText('Title/Designation', {
        x: width / 2 - 200,
        y: 112,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(payeeInformation.title, {
        x: width / 2 - 200,
        y: 120,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText('TIN', {
        x: width / 2 + 200,
        y: 112,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(payeeInformation.tin.join('-'), {
        x: width / 2 + 165,
        y: 120,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });
};

export const drawPayorSignatories = async(pdfDoc, font, payorInformation) => {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    const payorSignatureBlob = payorInformation.signature && await payorInformation.signature.arrayBuffer();
    const payorSignatory = payorSignatureBlob && await pdfDoc.embedPng(payorSignatureBlob);
    
    if (payorSignatory) firstPage.drawImage(payorSignatory, {
        x: width / 2 - 25,
        y: 200,
        width: 100,
        height: 25,
    });

    firstPage.drawText(payorInformation.name, {
        x: width / 2 - 50,
        y: 188,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText('Title/Designation', {
        x: width / 2 - 200,
        y: 188,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(payorInformation.title, {
        x: width / 2 - 200,
        y: 200,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText('TIN', {
        x: width / 2 + 200,
        y: 188,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(payorInformation.tin.join('-'), {
        x: width / 2 + 165,
        y: 200,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });
};

export const drawPayeeAgentSignatories = async(pdfDoc, font, taxAgentPayee) => {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    const taxAgentPayeeSignatureBlob = taxAgentPayee.signature && await taxAgentPayee.signature.arrayBuffer();
    const taxAgentPayeeSignatory = taxAgentPayeeSignatureBlob && await pdfDoc.embedPng(taxAgentPayeeSignatureBlob);

    if (taxAgentPayeeSignatory) firstPage.drawImage(taxAgentPayeeSignatory, {
        x: width / 2 - 25,
        y: 120,
        width: 100,
        height: 25, 
    });

    firstPage.drawText(taxAgentPayee.name, {
        x: width / 2 - 50,
        y: 112,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText('Title/Designation', {
        x: width / 2 - 200,
        y: 112,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(taxAgentPayee.title, {
        x: width / 2 - 200,
        y: 120,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText('TIN', {
        x: width / 2 + 200,
        y: 112,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(taxAgentPayee.tin.join('-'), {
        x: width / 2 + 165,
        y: 120,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(taxAgentPayee.accreditationNum, {
        x: width / 2 - 167,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    const { issueDay, issueMonth, issueYear } = {
        issueDay: ("0" + taxAgentPayee.issueDate.getDate()).slice(-2),
        issueMonth: ("0" + (taxAgentPayee.issueDate.getMonth() + 1)).slice(-2),
        issueYear: taxAgentPayee.issueDate.getFullYear().toString(),
    };

    const { expiryDay, expiryMonth, expiryYear } = {
        expiryDay: ("0" + taxAgentPayee.expiryDate.getDate()).slice(-2),
        expiryMonth: ("0" + (taxAgentPayee.expiryDate.getMonth() + 1)).slice(-2),
        expiryYear: taxAgentPayee.expiryDate.getFullYear().toString(),
    };

    // Drawing date of issue
    firstPage.drawText(issueMonth[0], {
        x: width / 2 + 15,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueMonth[1], {
        x: width / 2 + 28,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueDay[0], {
        x: width / 2 + 41,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueDay[1], {
        x: width / 2 + 54,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)

    });

    firstPage.drawText(issueYear[0], {
        x: width / 2 + 67,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueYear[1], {
        x: width / 2 + 80,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueYear[2], {
        x: width / 2 + 93,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueYear[3], {
        x: width / 2 + 106,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryMonth[0], {
        x: width / 2 + 185,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryMonth[1], {
        x: width / 2 + 198,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryDay[0], {
        x: width / 2 + 211,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryDay[1], {
        x: width / 2 + 224,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryYear[0], {
        x: width / 2 + 237,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryYear[1], {
        x: width / 2 + 250,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryYear[2], {
        x: width / 2 + 264,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryYear[3], {
        x: width / 2 + 277,
        y: 75,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });
};

export const drawPayorAgentSignatories = async(pdfDoc, font, taxAgentPayor) => {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();

    const taxAgentPayorSignatureBlob = taxAgentPayor.signature && await taxAgentPayor.signature.arrayBuffer();
    const taxAgentPayorSignatory = taxAgentPayorSignatureBlob && await pdfDoc.embedPng(taxAgentPayorSignatureBlob);

    if(taxAgentPayorSignatory) firstPage.drawImage(taxAgentPayorSignatory, {
        x: width / 2 - 25,
        y: 200,
        width: 100,
        height: 25,
    });

    firstPage.drawText(taxAgentPayor.name, {
        x: width / 2 - 50,
        y: 188,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText('Title/Designation', {
        x: width / 2 - 200,
        y: 188,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(taxAgentPayor.title, {
        x: width / 2 - 200,
        y: 200,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText('TIN', {
        x: width / 2 + 200,
        y: 188,
        size: 9,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(taxAgentPayor.tin.join('-'), {
        x: width / 2 + 165,
        y: 200,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(taxAgentPayor.accreditationNum, {
        x: width / 2 - 167,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    const { issueDay, issueMonth, issueYear } = {
        issueDay: ("0" + taxAgentPayor.issueDate.getDate()).slice(-2),
        issueMonth: ("0" + (taxAgentPayor.issueDate.getMonth() + 1)).slice(-2),
        issueYear: taxAgentPayor.issueDate.getFullYear().toString(),
    };

    const { expiryDay, expiryMonth, expiryYear } = {
        expiryDay: ("0" + taxAgentPayor.expiryDate.getDate()).slice(-2),
        expiryMonth: ("0" + (taxAgentPayor.expiryDate.getMonth() + 1)).slice(-2),
        expiryYear: taxAgentPayor.expiryDate.getFullYear().toString(),
    };

    // Drawing date of issue
    firstPage.drawText(issueMonth[0], {
        x: width / 2 + 15,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueMonth[1], {
        x: width / 2 + 28,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueDay[0], {
        x: width / 2 + 41,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueDay[1], {
        x: width / 2 + 54,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)

    });

    firstPage.drawText(issueYear[0], {
        x: width / 2 + 67,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueYear[1], {
        x: width / 2 + 80,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueYear[2], {
        x: width / 2 + 93,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(issueYear[3], {
        x: width / 2 + 106,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryMonth[0], {
        x: width / 2 + 185,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryMonth[1], {
        x: width / 2 + 198,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryDay[0], {
        x: width / 2 + 211,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryDay[1], {
        x: width / 2 + 224,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryYear[0], {
        x: width / 2 + 237,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryYear[1], {
        x: width / 2 + 250,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryYear[2], {
        x: width / 2 + 264,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });

    firstPage.drawText(expiryYear[3], {
        x: width / 2 + 277,
        y: 153,
        size: 11,
        font,
        color: rgb(0, 0, 0)
    });
};