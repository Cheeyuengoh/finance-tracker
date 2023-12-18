function validatedTransaction(type, formData) {
    if (formData.transaction === '' || formData.transaction === null) return false
    if (formData.category === '' || formData.category === null) return false
    if (formData.date === '' || formData.date === null) return false
    if (formData.amount === '' || formData.amount === null) return false
    if (type === 'update') {
        if (formData.uuid === '' || formData.uuid === null) return false;
    }
    return true;
}

function validatedCategory(type, formData) {
    if (formData.transaction === '' || formData.transaction === null) return false
    if (type === 'create') {
        if (formData.category === '' || formData.category === null) return false;
    }
    if (type === 'update') {
        if (formData.oldCategory === '' || formData.oldCategory === null) return false;
        if (formData.newCategory === '' || formData.newCategory === null) return false;
    }
    return true;
}

export { validatedTransaction, validatedCategory };