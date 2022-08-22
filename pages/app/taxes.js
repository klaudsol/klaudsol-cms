import { useState, useEffect } from 'react'
import InnerLayout from '@/components/layouts/InnerLayout';
import CacheContext from '@/components/contexts/CacheContext';
import { getSessionCache } from '@/lib/Session';

import { PDFDocument, StandardFonts } from 'pdf-lib';
import { slsFetch } from '@/components/Util';
import PayeeForm from "@/components/taxes/PayeeForm";
import PayorForm from "@/components/taxes/PayorForm";
import { drawPeriod, drawPayeeInformation, drawPayorInformation,
         drawIncomePayments, drawMoneyPayments, drawPayeeSignatories,
         drawPayorSignatories, drawPayeeAgentSignatories, drawPayorAgentSignatories } from "@/components/taxes/drawFunctions";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSpinner } from "@coreui/react";

import styles from "@/styles/taxes/TaxesPage.module.scss";

import Table from "@/components/taxes/Table";

export default function TaxesPage({ cache }) {

    const [pdfBytes, setPdfBytes] = useState(null);     // Contains the bytes for the intial PDF
    const [pdfURL, setPdfURL] = useState(null);         // Contains the allocated object URL for PDF preview
    const [objectsToFree, setObjectsToFree] = useState([]);
    const [isFetchingPDF, setIsFetchingPDF] = useState(false);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [incomePayments, setIncomePayments] = useState({
        rows: [],
        rowToEdit: -1,
        isEditing: false
    });

    const [moneyPayments, setMoneyPayments] = useState({
        rows: [],
        rowToEdit: -1,
        isEditing: false
    });

    const incomePaymentsColumns = [
        { key: "income_payments", label: "Income Payments Subject to Expanded Withholding Tax" },
        { key: "atc", label: "ATC" },
        { key: "first_month", label: "Amount of Income Payments - 1st Month of the Quarter" },
        { key: "second_month", label: "Amount of Income Payments - 2nd Month of the Quarter" },
        { key: "third_month", label: "Amount of Income Payments - 3rd Month of the Quarter" },
        { key: "tax_withheld", label: "Tax Withheld for the Quarter" }
    ];

    const moneyPaymentsColumns = [
        { key: "income_payments", label: "Money Payments Subject to Withholding of Business Tax (Government & Private)" },
        { key: "atc", label: "ATC" },
        { key: "first_month", label: "Amount of Income Payments - 1st Month of the Quarter" },
        { key: "second_month", label: "Amount of Income Payments - 2nd Month of the Quarter" },
        { key: "third_month", label: "Amount of Income Payments - 3rd Month of the Quarter" },
        { key: "tax_withheld", label: "Tax Withheld for the Quarter" }
    ];

    const [payeeInformation, setPayeeInformation] = useState({
        tin: ['', '', '', ''],
        name: '',
        regAddress: '',
        zipCode: '',
        foreignAddress: '',
        hasTaxAgent: false,
        title: '',
        tan: '',
        signature: null,
    });

    const [taxAgentPayee, setTaxAgentPayee] = useState({
        name: '',
        accreditationNum: '',
        issueDate: new Date(),
        expiryDate: new Date(),
        title: '',
        tin: ['', '', '', ''],
        signature: null
    });

    const [payorInformation, setPayorInformation] = useState({
        tin: ['', '', '', ''],
        name: '',
        regAddress: '',
        zipCode: '',
        hasTaxAgent: false,
        title: '',
        tan: '',
        signature: null,
    });

    const [taxAgentPayor, setTaxAgentPayor] = useState({
        name: '',
        accreditationNum: '',
        issueDate: new Date(),
        expiryDate: new Date(),
        title: '',
        tin: ['', '', '', ''],
        signature: null
    });

    const incomePaymentsAddRow = (input) => setIncomePayments({ ...incomePayments, rows: [...incomePayments.rows, input] });

    const incomePaymentsDeleteRow = (indexToDelete) => {
        const newRows = incomePayments.rows.filter( (row, indexCurrent) => {
            if (indexCurrent !== indexToDelete) return row;
        });

        setIncomePayments({ ...incomePayments, rows: newRows });
    }

    const incomePaymentsEditRow = (index) => {
        setIncomePayments({
            ...incomePayments,
            isEditing: true,
            rowToEdit: index
        });
    }

    const incomePaymentsEditSaveRow = (indexToEdit, updatedRow) => {
        const newRows = incomePayments.rows.map( (row, indexCurrent) => {
            if (indexCurrent === indexToEdit) return updatedRow;
            return row;
        });

        setIncomePayments({
            rows: newRows,
            isEditing: false,
            rowToEdit: -1
        });
    };

    const incomePaymentsCancelEdit = () => {
        setIncomePayments({
            ...incomePayments,
            isEditing: false,
            rowToEdit: -1
        });
    }

    const moneyPaymentsAddRow = (input) => setMoneyPayments({ ...moneyPayments, rows: [...moneyPayments.rows, input] });

    const moneyPaymentsDeleteRow = (indexToDelete) => {
        const newRows = moneyPayments.rows.filter( (row, indexCurrent) => {
            if (indexCurrent !== indexToDelete) return row;
        });

        setMoneyPayments({ ...moneyPayments, rows: newRows });
    }

    const moneyPaymentsEditRow = (index) => {
        setMoneyPayments({
            ...moneyPayments,
            isEditing: true,
            rowToEdit: index
        });
    }

    const moneyPaymentsEditSaveRow = (indexToEdit, updatedRow) => {
        const newRows = moneyPayments.rows.map( (row, indexCurrent) => {
            if (indexCurrent === indexToEdit) return updatedRow;
            return row;
        });

        setMoneyPayments({
            rows: newRows,
            isEditing: false,
            rowToEdit: -1
        });
    };

    const moneyPaymentsCancelEdit = () => {
        setMoneyPayments({
            ...moneyPayments,
            isEditing: false,
            rowToEdit: -1
        });
    }

    const savePDF = async () => {
        try {
            const pdf = await PDFDocument.load(pdfBytes);
            const font = await pdf.embedFont(StandardFonts.Helvetica);

            drawPeriod(pdf, font, startDate, endDate);
            drawPayeeInformation(pdf, font, payeeInformation);
            drawPayorInformation(pdf, font, payorInformation);
            drawIncomePayments(pdf, font, incomePayments);
            drawMoneyPayments(pdf, font, moneyPayments);

            if(payeeInformation.hasTaxAgent) await drawPayeeAgentSignatories(pdf, font, taxAgentPayee);
            else await drawPayeeSignatories(pdf, font, payeeInformation);

            if(payorInformation.hasTaxAgent) await drawPayorAgentSignatories(pdf, font, taxAgentPayor);
            else await drawPayorSignatories(pdf, font, payorInformation);

            const newPdf = await pdf.save();
            const bytes = new Uint8Array(newPdf);
            const blob = new Blob([bytes], { type: "application/pdf" });

            const newPdfURL = URL.createObjectURL(blob);

            window.open(newPdfURL);

            setPdfURL(newPdfURL);
            setObjectsToFree([ ...objectsToFree, newPdfURL ]);
        } catch(ex) {
            console.error(ex);
        }
    }

    const fetchPDF = async () => {
        try {
            setIsFetchingPDF(true);

            const pdfRaw = await slsFetch('/api/app/taxes/form');
            const pdfBytes = await pdfRaw.arrayBuffer();

            const bytes = new Uint8Array(pdfBytes);
            const blob = new Blob([bytes], { type: "application/pdf" });

            setPdfBytes(pdfBytes);

            const newPdfURL = URL.createObjectURL(blob);

            setPdfURL(newPdfURL);
            setObjectsToFree([ ...objectsToFree, newPdfURL ]);
        } catch (ex) {
            console.error(ex);
        } finally {
            setIsFetchingPDF(false);
        }
    };

    useEffect( async () => {
        await fetchPDF();

        return () => {
            objectsToFree.forEach( (objectURL) => {
                URL.revokeObjectURL(objectURL);
            });
        }
    }, []);
    
    return (
      <CacheContext.Provider value={cache}>
        <InnerLayout>
            <header>
                <h2>Form 2307 Generator</h2>
                <hr />
            </header>

            { isFetchingPDF ? (
                <span>
                    <CSpinner size="sm" className={styles["spinner"]}/>
                    Fetching PDF template...
                </span>
            ) : (
                <>
                    <div className={styles["period-selector-container"]}>
                        <label>Period:</label>

                        <div className={styles["datepicker-container"]}>
                            <DatePicker className="datepicker"
                                        dateFormat="MMMM d, yyyy"
                                        timeInputLabel="Start Date:"
                                        selected={startDate}
                                        onChange={ (date) => setStartDate(date) }
                                        />
                        </div>

                        <span>to</span>

                        <div className={styles["datepicker-container"]}>
                            <DatePicker className="datepicker"
                                        dateFormat="MMMM d, yyyy"
                                        timeInputLabel="End Date:"
                                        selected={endDate}
                                        onChange={ (date) => setEndDate(date) }
                                        />
                        </div>
                    </div>

                    <br />

                    {/* Payee Information */}
                    <div className={styles["payee-payor-container"]}>
                        <h5>Part 1 - Payee Information</h5>
                        <hr />

                        <PayeeForm payeeInformation={payeeInformation}
                                setPayeeInformation={setPayeeInformation}
                                taxAgentPayee={taxAgentPayee}
                                setTaxAgentPayee={setTaxAgentPayee}
                                />
                        <hr />
                    </div>
                    
                    <br />

                    {/* Payor Information */}
                    <div className={styles["payee-payor-container"]}>
                        <h5>Part 2 - Payor Information</h5>

                        <PayorForm payorInformation={payorInformation}
                                setPayorInformation={setPayorInformation}
                                taxAgentPayor={taxAgentPayor}
                                setTaxAgentPayor={setTaxAgentPayor}
                                />
                        <hr />
                    </div>  

                    <br />

                    <div>
                        <h5>Part 3 - Details of Monthly Income Payments and Taxes Withheld</h5>
                        <hr />

                        <div className="card_general card_timesheet">
                            <Table className="table_container" columns={incomePaymentsColumns} 
                                rows={incomePayments.rows} 
                                rowToEdit={incomePayments.rowToEdit} 
                                addRow={incomePaymentsAddRow} 
                                deleteRow={incomePaymentsDeleteRow} 
                                editRow={incomePaymentsEditRow}
                                isEditing={incomePayments.isEditing}
                                editSaveRow={incomePaymentsEditSaveRow}
                                cancelEdit={incomePaymentsCancelEdit} />
                        </div>

                        <div className="card_general card_timesheet">
                            <Table columns={moneyPaymentsColumns} 
                                rows={moneyPayments.rows} 
                                rowToEdit={moneyPayments.rowToEdit} 
                                addRow={moneyPaymentsAddRow} 
                                deleteRow={moneyPaymentsDeleteRow} 
                                editRow={moneyPaymentsEditRow}
                                isEditing={moneyPayments.isEditing}
                                editSaveRow={moneyPaymentsEditSaveRow}
                                cancelEdit={moneyPaymentsCancelEdit} />
                        </div>
                    </div>

                    <hr />

                    <button className={styles["button"]} onClick={ async (e) => {
                        e.preventDefault();
                        await savePDF();
                    }}>Generate PDF</button>
                    
                    <br />
                </>
            )}
        </InnerLayout>
      </CacheContext.Provider>
    );
}

export const getServerSideProps = getSessionCache();