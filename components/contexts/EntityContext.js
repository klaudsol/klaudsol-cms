import { createContext, useContext } from 'react';

const EntityContext = createContext();

export const useEntityContext = () => useContext(EntityContext);

export default EntityContext;
