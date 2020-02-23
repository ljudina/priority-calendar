const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const formatDate = (date) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.getDate() + "-" + months[dateObj.getMonth()] + "-" + dateObj.getFullYear();
    return formattedDate;
}

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};