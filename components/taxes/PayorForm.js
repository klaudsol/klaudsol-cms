import SMEFormInput from "@/lib/sme/SMEFormInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileInput from "@/components/taxes/FileInput";

import styles from "@/styles/taxes/TaxesPage.module.scss";

const PayorForm = ({ payorInformation, setPayorInformation, taxAgentPayor, setTaxAgentPayor }) => {
    return (
        <div className={styles["form"]}>
            <label>Taxpayer Identification Number (TIN):</label>
            <div className={styles["tin-inputs"]}>
                <SMEFormInput maxlength="3" 
                                type="text" 
                                value={payorInformation.tin[0]} 
                                onChange={(e) => {
                                    setPayorInformation({ ...payorInformation, tin: payorInformation.tin.map( (tinPart, index) => {
                                    if(index === 0) return e.target.value;
                                    return tinPart;
                                    })});
                                }}/>
                <span>-</span>
                <SMEFormInput maxlength="3" 
                                type="text" 
                                value={payorInformation.tin[1]} 
                                onChange={(e) => {
                                setPayorInformation({ ...payorInformation, tin: payorInformation.tin.map( (tinPart, index) => {
                                if(index === 1) return e.target.value;
                                return tinPart;
                                })});
                                }}/>
                <span>-</span>
                <SMEFormInput maxlength="3" 
                                type="text" 
                                value={payorInformation.tin[2]} 
                                onChange={(e) => {
                                setPayorInformation({ ...payorInformation, tin: payorInformation.tin.map( (tinPart, index) => {
                                if(index === 2) return e.target.value;
                                return tinPart;
                                })});
                                }}/>
                <span>-</span>
                <SMEFormInput maxlength="5" 
                                type="text" 
                                value={payorInformation.tin[3]} 
                                onChange={(e) => {
                                setPayorInformation({ ...payorInformation, tin: payorInformation.tin.map( (tinPart, index) => {
                                if(index === 3) return e.target.value;
                                return tinPart;
                                })});
                                }}/>
            </div>

            <label>Payor&apos;s Name:</label>
            <SMEFormInput type="text"
                            value={payorInformation.name}
                            placeholder="Last Name, First Name, Middle Name"
                            onChange={ (e) => {
                            setPayorInformation({ ...payorInformation, name: e.target.value });
                            }}/>

            <label>Registered Address:</label>
            <SMEFormInput type="text"
                            value={payorInformation.regAddress}
                            onChange={ (e) => {
                            setPayorInformation({ ...payorInformation, regAddress: e.target.value });
                            }}/>

            <label>Zip Code:</label>
            <SMEFormInput maxlength="4"
                            type="text"
                            value={payorInformation.zipCode}
                            onChange={ (e) => {
                            setPayorInformation({ ...payorInformation, zipCode: e.target.value });
                            }}/>

            <label>Payor has an authorized tax agent:</label>
            <input type="checkbox" 
                    checked={payorInformation.hasTaxAgent}
                    onChange={ (e) => setPayorInformation({ ...payorInformation, hasTaxAgent: e.target.checked })}
                    />
    
            {payorInformation.hasTaxAgent && (
                <>
                    <label>Tax Agent&apos;s Name:</label>
                    <SMEFormInput type="text"
                                    value={taxAgentPayor.name}
                                    placeholder="Last Name, First Name, Middle Name"
                                    onChange={ (e) => {
                                        setTaxAgentPayor({ ...taxAgentPayor, name: e.target.value });
                                    }}/>

                    <label>Tax Agent&apos;s Title/Designation:</label>
                    <SMEFormInput type="text"
                                    value={taxAgentPayor.title}
                                    onChange={ (e) => {
                                        setTaxAgentPayor({ ...taxAgentPayor, title: e.target.value });
                                    }}/>

                    <label>Tax Agent&apos;s Accreditation No./Attorney&apos;s Roll No.:</label>
                    <SMEFormInput type="text"
                                    value={taxAgentPayor.accreditationNum}
                                    onChange={ (e) => {
                                        setTaxAgentPayor({ ...taxAgentPayor, accreditationNum: e.target.value });
                                    }}/>

                    <label>Date Issued:</label>
                    <div>
                        <DatePicker className={`datepicker ${styles["datepicker-container"]}`}
                                    dateFormat="MMMM d, yyyy"
                                    timeInputLabel="Start Date:"
                                    selected={taxAgentPayor.issueDate}
                                    onChange={ (date) => setTaxAgentPayor({ ...taxAgentPayor, issueDate: date }) }
                                    />
                    </div>

                    <label>Expiry Date:</label>
                    <div>
                        <DatePicker className={`datepicker ${styles["datepicker-container"]}`}
                                    dateFormat="MMMM d, yyyy"
                                    timeInputLabel="Start Date:"
                                    selected={taxAgentPayor.expiryDate}
                                    onChange={ (date) => setTaxAgentPayor({ ...taxAgentPayor, expiryDate: date }) }
                                    />
                    </div>

                    <label>Tax Agent&apos;s TIN:</label>
                    <div className={styles["tin-inputs"]}>
                        <SMEFormInput maxlength="3" 
                                    type="text" 
                                    value={taxAgentPayor.tin[0]} 
                                    onChange={(e) => {
                                        setTaxAgentPayor({ ...taxAgentPayor, tin: taxAgentPayor.tin.map( (tinPart, index) => {
                                            if(index === 0) return e.target.value;
                                            return tinPart;
                                        })});
                                    }}/>
                        <span>-</span>
                        <SMEFormInput maxlength="3" 
                                    type="text" 
                                    value={taxAgentPayor.tin[1]} 
                                    onChange={(e) => {
                                        setTaxAgentPayor({ ...taxAgentPayor, tin: taxAgentPayor.tin.map( (tinPart, index) => {
                                        if(index === 1) return e.target.value;
                                        return tinPart;
                                        })});
                                    }}/>
                        <span>-</span>
                        <SMEFormInput maxlength="3" 
                                    type="text" 
                                    value={taxAgentPayor.tin[2]} 
                                    onChange={(e) => {
                                        setTaxAgentPayor({ ...taxAgentPayor, tin: taxAgentPayor.tin.map( (tinPart, index) => {
                                        if(index === 2) return e.target.value;
                                        return tinPart;
                                        })});
                                    }}/>
                        <span>-</span>
                        <SMEFormInput maxlength="5" 
                                    type="text" 
                                    value={taxAgentPayor.tin[3]} 
                                    onChange={(e) => {
                                        setTaxAgentPayor({ ...taxAgentPayor, tin: taxAgentPayor.tin.map( (tinPart, index) => {
                                        if(index === 3) return e.target.value;
                                        return tinPart;
                                        })});
                                    }}/>
                    </div>
                    

                    <label>Tax Agent&apos;s Signature:</label>
                    <FileInput accept="image/png"
                               fileName={taxAgentPayor.signature?.name}
                               onFileChange={ (e) => {
                                   setTaxAgentPayor({ ...taxAgentPayor, signature: e.target.files[0] });
                               }}
                               />
                </>
            )}

            {!(payorInformation.hasTaxAgent) && (
                <>
                    <label>Payor&apos;s Title/Designation:</label>
                    <SMEFormInput type="text"
                                value={payorInformation.title}
                                onChange={ (e) => {
                                    setPayorInformation({ ...payorInformation, title: e.target.value });
                                }}/>

                    <label>Payor&apos;s Signature:</label>
                    <FileInput accept="image/png"
                               fileName={payorInformation.signature?.name}
                               onFileChange={ (e) => {
                                   setPayorInformation({ ...payorInformation, signature: e.target.files[0] });
                               }}
                               />
                </>
            )}
            
        </div>
    );
};

export default PayorForm;