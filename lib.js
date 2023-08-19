const EXPENSE_CATEGORIES = ['Category', 'Education', 'Food/Eatables', 'Bills', 'Rent', 'Home Needs', 'Vehicles', 'Child', 'Medical', 'Beauty and Care', 'Clothing', 'Enjoyment', 'Personal Need', 'Investment', 'Gifts', 'Other', 'Monthly Income'];
const INVESTMENT_CATEGORIES = ['Category', 'Fixed Deposit', 'PPF', 'Stocks', 'KVP', 'Mutual Funds', 'NSC', 'SCSS', 'Monthly Income Scheme', 'Life Insurance', 'Other'];

module.exports.convertExpSearchDataToJson = (dataArr) => {
    const res = [];
    for (let i = 0; i < dataArr.length; i++) {
        if (!dataArr[i]) continue;
        const line = dataArr[i].replace(/\0/g, '0');
        if (line.search(/^[0-9]+\./) === 0) {
            const doc = {};
            const title = line.split('[');
            if (title && title.length > 1) {
                doc.title = title[0].replace(/^[0-9]+\./, '').trim();
                doc.category = title[1].trim().replace(']', '');
            } else {
                continue;
            }
            let j = i + 1;
            while (j < i + 6 && j < dataArr.length) {
                const line = dataArr[j];
                const amount = line.split('Amount:'), status = line.split('Status:'), date = line.split('Date:');
                if (date && date.length > 1) {
                    doc.date = new Date(date[1].trim());
                    break;
                } else if (amount && amount.length > 1) {
                    doc.amount = amount[1].trim();
                } else if (status && status.length > 1) {
                    doc.status = status[1].trim();
                } else {
                    doc.description = line.trim();
                }
                j++;
            }
            i = j-1;
            res.push(doc);
        }
    }
    return res;
}

module.exports.convertExpCategoryDataToJson = (dataArr) => {
    const res = [];
    for (let i = 0; i < dataArr.length; i++) {
        if (!dataArr[i]) continue;
        const line = dataArr[i].replace(/\0/g, '0');
        let category = '';
        if (EXPENSE_CATEGORIES.includes(line.trim())) {
            category = category;
        }
        if (line.search(/^[0-9]+\./) === 0) {
            const doc = { category };
            doc.title = line.replace(/^[0-9]+\./, '').trim();
            let j = i + 1;
            while (j < i + 6 && j < dataArr.length) {
                const line = dataArr[j];
                const amount = line.split('Amount:'), status = line.split('Status:'), date = line.split('Date:');
                if (date && date.length > 1) {
                    doc.date = new Date(date[1].trim());
                    break;
                } else if (amount && amount.length > 1) {
                    doc.amount = amount[1].trim();
                } else if (status && status.length > 1) {
                    doc.status = status[1].trim();
                } else {
                    doc.description = line.trim();
                }
                j++;
            }
            i = j-1;
            res.push(doc);
        }
    }
    return res;
}

module.exports.convertInvDataToJson = (dataArr) => {
    const res = [];
    for (let i = 0; i < dataArr.length; i++) {
        if (!dataArr[i]) continue;
        const line = dataArr[i].replace(/\0/g, '0');
        let category = '';
        if (INVESTMENT_CATEGORIES.includes(line.trim())) {
            category = category;
        }
        if (line.search(/^[0-9]+\./) === 0) {
            const doc = { category };
            doc.title = line.replace(/^[0-9]+\./, '').trim();
            let j = i + 1;
            while (j < i + 6 && j < dataArr.length) {
                const line = dataArr[j];
                const amount = line.split('Amount:'), status = line.split('Status:'), date = line.split('Date:');
                if (date && date.length > 1) {
                    doc.date = new Date(date[1].trim());
                    break;
                } else if (amount && amount.length > 1) {
                    doc.amount = amount[1].trim();
                } else if (status && status.length > 1) {
                    doc.status = status[1].trim();
                } else {
                    doc.description = line.trim();
                }
                j++;
            }
            i = j-1;
            res.push(doc);
        }
    }
    return res;
}