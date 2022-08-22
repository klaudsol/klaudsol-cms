import { useState } from "react";

import { CTable, CTableHead, CTableRow,
         CTableHeaderCell, CTableBody, CTableDataCell } from "@coreui/react";

import { FaEdit, FaTrash, FaPlus,
         FaSave, FaTimes  } from "react-icons/fa";
import SMEFormInput from "@/lib/sme/SMEFormInput";

import styles from "@/styles/taxes/TaxesPage.module.scss";

const Table = ({ columns, rows, isEditing, rowToEdit, addRow, deleteRow, editRow, editSaveRow, cancelEdit }) => {

    const initialAddInput = Object.fromEntries(
        new Map(columns.map( (col) => {
            return [col.key, ''];
        }))
    );

    const [addInput, setAddInput] = useState(initialAddInput);
    const [editInput, setEditInput] = useState({});

    const onAddInputChange = (e, key) => setAddInput({ ...addInput, [key]: e.target.value });

    const onAdd = () => {
        addRow(addInput);
        setAddInput(initialAddInput);
    }

    const onDelete = (index) => deleteRow(index);

    const onEdit = (index) => {
        editRow(index);
        setEditInput(rows[index]);
    };

    const onEditSave = (index) => {
        editSaveRow(index, editInput);
        setEditInput({});
    }

    const onEditInputChange = (e, key) => setEditInput({ ...editInput, [key]: e.target.value });

    const onCancelEdit = () => cancelEdit();

    return (
        <CTable striped className={styles["table"]}>
            <CTableHead>
                <CTableRow>
                    {columns.map( (col, index) => (
                        <CTableHeaderCell key={index} scope="col">{col.label}</CTableHeaderCell>
                    ))}
                    <CTableHeaderCell key={columns.length}></CTableHeaderCell>
                </CTableRow>
            </CTableHead>

            <CTableBody>
                {rows && rows.map( (row, rowIndex) => (
                    <CTableRow key={rowIndex}>
                        {columns.map( ({ key }, colIndex) => {
                            if (isEditing && rowIndex === rowToEdit) return <CTableDataCell key={colIndex}><SMEFormInput className={styles["form-input"]} value={editInput[key]} onChange={(e) => onEditInputChange(e, key)} /></CTableDataCell>
                            return <CTableDataCell key={colIndex}>{row[key]}</CTableDataCell>
                        })}
                        {isEditing && rowIndex === rowToEdit && (
                            <CTableDataCell key={columns.length} className={styles["button-container"]}>
                                <button className="btn_save" onClick={() => onEditSave(rowIndex)}><FaSave /></button>
                                <button className="btn_edit" onClick={() => onCancelEdit()}><FaTimes /></button>
                            </CTableDataCell>
                        )}
                        {rowIndex !== rowToEdit && (
                            <CTableDataCell key={columns.length} className={styles["button-container"]}>
                                <button disabled={isEditing} className="btn_edit" onClick={() => onEdit(rowIndex)}><FaEdit /></button>
                                <button disabled={isEditing} className="btn_delete" onClick={() => onDelete(rowIndex)}><FaTrash /></button>
                            </CTableDataCell>
                        )}
                    </CTableRow>
                ))}
                {rows.length < 10 && (
                    <CTableRow>
                        {columns.map( ({ key }, index) => {
                            return <CTableDataCell key={index}><SMEFormInput className={styles["form-input"]} value={addInput[key]} onChange={(e) => onAddInputChange(e, key)}/></CTableDataCell>
                        })}
                        <CTableDataCell key={columns.length} className={styles["button-container"]}>
                            <button disabled={isEditing} className="btn_add_time" onClick={onAdd}><FaPlus /></button>
                        </CTableDataCell>
                    </CTableRow>
                )}
            </CTableBody>
        </CTable>
    );
};

export default Table;