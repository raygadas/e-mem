
export const formatDate = (timestamp) =>{
    if (!timestamp) return;
    
    const date_options = {
        year: "numeric",
        month: "long",
        day: "numeric"
    }

    let date = new Date(timestamp.toDate());

    return date.toLocaleDateString("en-US", date_options)
} 