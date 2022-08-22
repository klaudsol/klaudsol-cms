import SMESmartTableDesktop from './SMESmartTable/SMESmartTableDesktop';
import SMESmartTableMobile from './SMESmartTable/SMESmartTableMobile';
import { 
  cilPencil,
  cilTrash,
  cilCheckAlt,
  cilX,
  cilPlus
} from '@coreui/icons';
const SMESmartTable = (props) => {
  
  return (
    <>
      <SMESmartTableDesktop {...props} />
      <SMESmartTableMobile {...props} />
    </>
  )
  
}

export const access = (item, accessor) => {
  if(typeof accessor === 'string') {
    return item[accessor];  
  } else if (typeof accessor ===  'function') {
    return accessor(item);
  }
}

export const defaultEditRowAction = (row, rowEffects) => {
  rowEffects.editMode(row.id, true);
  rowEffects.fadeIn(row.id);  
};

export const defaultUpdateCancelRowAction = (row, rowEffects) => {
  rowEffects.editMode(row.id, false);
  rowEffects.fadeIn(row.id);  
};

export const defaultDeleteRowAction = (row, rowEffects, message = "Are you sure you want to delete this row?", callback = null) => {
    if(window.confirm("Are you sure you want to delete this row?")) {
      (async () => {
        
        if (callback) {
          const success = await callback(row, rowEffects);  
          if(success) {
            rowEffects.fadeOut(row.id);
          }
        } else {
          //noop 
        }
      })();
    }
};

export const DEFAULT_ADD_FORM_ACTION = {name: 'add', label: 'Add', icon: cilPlus, action: (form, rowEffects, formEffects) => {}}
export const DEFAULT_EDIT_ROW_ACTION = {name: 'edit', label: 'Edit', icon: cilPencil, action: defaultEditRowAction}
export const DEFAULT_DELETE_ROW_ACTION = {name: 'delete', label: 'Delete', icon: cilTrash, action: defaultDeleteRowAction}
export const DEFAULT_UPDATE_SAVE_ROW_ACTION = {name: 'updateSave', label: 'Update', icon: cilCheckAlt, action: (row, rowEffects) => {}, show: {onView: false, onEdit: true}}
export const DEFAULT_UPDATE_CANCEL_ROW_ACTION = {name: 'updateCancel', label: 'Cancel', icon: cilX, action: defaultUpdateCancelRowAction, show: {onView: false, onEdit: true}}


SMESmartTable.defaultProps = {
  loading: false  
}

export default SMESmartTable;