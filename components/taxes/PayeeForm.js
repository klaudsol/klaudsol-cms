import SMEFormInput from "@/lib/sme/SMEFormInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileInput from "@/components/taxes/FileInput";

import styles from "@/styles/taxes/TaxesPage.module.scss";

const PayeeForm = ({ payeeInformation, setPayeeInformation, taxAgentPayee, setTaxAgentPayee }) => {
    return (
        <div className={styles["form"]}>
            <label>Taxpayer Identification Number (TIN):</label>
            <div className={styles["tin-inputs"]}>
                <SMEFormInput maxlength="3" 
                                type="text" 
                                value={payeeInformation.tin[0]} 
                                onChange={(e) => {
                                    setPayeeInformation({ ...payeeInformation, tin: payeeInformation.tin.map( (tinPart, index) => {
                                    if(index === 0) return e.target.value;
                                    return tinPart;
                                    })});
                                }}/>
                <span>-</span>
                <SMEFormInput maxlength="3" 
                                type="text" 
                                value={payeeInformation.tin[1]} 
                                onChange={(e) => {
                                setPayeeInformation({ ...payeeInformation, tin: payeeInformation.tin.map( (tinPart, index) => {
                                if(index === 1) return e.target.value;
                                return tinPart;
                                })});
                                }}/>
                <span>-</span>
                <SMEFormInput maxlength="3" 
                                type="text" 
                                value={payeeInformation.tin[2]} 
                                onChange={(e) => {
                                setPayeeInformation({ ...payeeInformation, tin: payeeInformation.tin.map( (tinPart, index) => {
                                if(index === 2) return e.target.value;
                                return tinPart;
                                })});
                                }}/>
                <span>-</span>
                <SMEFormInput maxlength="5" 
                                type="text" 
                                value={payeeInformation.tin[3]} 
                                onChange={(e) => {
                                setPayeeInformation({ ...payeeInformation, tin: payeeInformation.tin.map( (tinPart, index) => {
                                if(index === 3) return e.target.value;
                                return tinPart;
                                })});
                                }}/>
            </div>

            <label>Payee&apos;s Name:</label>
            <SMEFormInput type="text"
                            value={payeeInformation.name}
                            placeholder="Last Name, First Name, Middle Name"
                            onChange={ (e) => {
                            setPayeeInformation({ ...payeeInformation, name: e.target.value });
                            }}/>

            <label>Registered Address:</label>
            <SMEFormInput type="text"
                            value={payeeInformation.regAddress}
                            onChange={ (e) => {
                            setPayeeInformation({ ...payeeInformation, regAddress: e.target.value });
                            }}/>

            <label>Zip Code:</label>
            <SMEFormInput maxlength="4"
                            type="text"
                            value={payeeInformation.zipCode}
                            onChange={ (e) => {
                            setPayeeInformation({ ...payeeInformation, zipCode: e.target.value });
                            }}/>

            <label>Foreign Address:</label>
            <SMEFormInput type="text"
                            value={payeeInformation.foreignAddress}
                            onChange={ (e) => {
                            setPayeeInformation({ ...payeeInformation, foreignAddress: e.target.value });
                            }}/>

            <label>Payee has an authorized tax agent:</label>
            <input type="checkbox" 
                    checked={payeeInformation.hasTaxAgent}
                    onChange={ (e) => setPayeeInformation({ ...payeeInformation, hasTaxAgent: e.target.checked })}
                    />

            {payeeInformation.hasTaxAgent && (
                <>
                    <label>Tax Agent&apos;s Name:</label>
                    <SMEFormInput type="text"
                                    value={taxAgentPayee.name}
                                    placeholder="Last Name, First Name, Middle Name"
                                    onChange={ (e) => {
                                        setTaxAgentPayee({ ...taxAgentPayee, name: e.target.value });
                                    }}/>

                    <label>Tax Agent&apos;s Title/Designation:</label>
                    <SMEFormInput type="text"
                                    value={taxAgentPayee.title}
                                    onChange={ (e) => {
                                        setTaxAgentPayee({ ...taxAgentPayee, title: e.target.value });
                                    }}/>

                    <label>Tax Agent&apos;s Accreditation No./Attorney&apos;s Roll No.:</label>
                    <SMEFormInput type="text"
                                    value={taxAgentPayee.accreditationNum}
                                    onChange={ (e) => {
                                        setTaxAgentPayee({ ...taxAgentPayee, accreditationNum: e.target.value });
                                    }}/>

                    <label>Date Issued:</label>
                    <div>
                        <DatePicker className={`datepicker ${styles["datepicker-container"]}`}
                                    dateFormat="MMMM d, yyyy"
                                    timeInputLabel="Start Date:"
                                    selected={taxAgentPayee.issueDate}
                                    onChange={ (date) => setTaxAgentPayee({ ...taxAgentPayee, issueDate: date }) }
                                    />
                    </div>

                    <label>Expiry Date:</label>
                    <div>
                        <DatePicker className={`datepicker ${styles["datepicker-container"]}`}
                                    dateFormat="MMMM d, yyyy"
                                    timeInputLabel="Start Date:"
                                    selected={taxAgentPayee.expiryDate}
                                    onChange={ (date) => setTaxAgentPayee({ ...taxAgentPayee, expiryDate: date }) }
                                    />
                    </div>

                    <label>Tax Agent&apos;s TIN:</label>
                    <div className={styles["tin-inputs"]}>
                        <SMEFormInput maxlength="3" 
                                    type="text" 
                                    value={taxAgentPayee.tin[0]} 
                                    onChange={(e) => {
                                        setTaxAgentPayee({ ...taxAgentPayee, tin: taxAgentPayee.tin.map( (tinPart, index) => {
                                            if(index === 0) return e.target.value;
                                            return tinPart;
                                        })});
                                    }}/>
                        <span>-</span>
                        <SMEFormInput maxlength="3" 
                                    type="text" 
                                    value={taxAgentPayee.tin[1]} 
                                    onChange={(e) => {
                                        setTaxAgentPayee({ ...taxAgentPayee, tin: taxAgentPayee.tin.map( (tinPart, index) => {
                                        if(index === 1) return e.target.value;
                                        return tinPart;
                                        })});
                                    }}/>
                        <span>-</span>
                        <SMEFormInput maxlength="3" 
                                    type="text" 
                                    value={taxAgentPayee.tin[2]} 
                                    onChange={(e) => {
                                        setTaxAgentPayee({ ...taxAgentPayee, tin: taxAgentPayee.tin.map( (tinPart, index) => {
                                        if(index === 2) return e.target.value;
                                        return tinPart;
                                        })});
                                    }}/>
                        <span>-</span>
                        <SMEFormInput maxlength="5" 
                                    type="text" 
                                    value={taxAgentPayee.tin[3]} 
                                    onChange={(e) => {
                                        setTaxAgentPayee({ ...taxAgentPayee, tin: taxAgentPayee.tin.map( (tinPart, index) => {
                                        if(index === 3) return e.target.value;
                                        return tinPart;
                                        })});
                                    }}/>
                    </div>
                    

                    <label>Tax Agent&apos;s Signature:</label>
                    <FileInput accept="image/png"
                               fileName={taxAgentPayee.signature?.name}
                               onFileChange={ (e) => {
                                   setTaxAgentPayee({ ...taxAgentPayee, signature: e.target.files[0] });
                               }}
                               />
                </>
            )}

            {!(payeeInformation.hasTaxAgent) && (
                <>
                    <label>Payee&apos;s Title/Designation:</label>
                    <SMEFormInput type="text"
                                    value={payeeInformation.title}
                                    onChange={ (e) => {
                                        setPayeeInformation({ ...payeeInformation, title: e.target.value });
                                    }}/>

                    <label>Payee&apos;s Signature:</label>
                    <FileInput accept="image/png"
                               fileName={payeeInformation.signature?.name}
                               onFileChange={ (e) => {
                                   setPayeeInformation({ ...payeeInformation, signature: e.target.files[0] });
                               }}
                               />
                </>
            )}
        </div>
    );
};

export default PayeeForm;