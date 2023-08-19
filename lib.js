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
                doc.category = title[1].trim().replace(']', '').trim();
            } else {
                continue;
            }
            doc.description = '';
            let j = i + 1;
            while (j < i + 6 && j < dataArr.length) {
                const line = dataArr[j];
                const amount = line.split('Amount:'), status = line.split('Status:'), date = line.split('Date:');
                if (date && date.length > 1) {
                    doc.date = new Date(date[1].trim())?.toISOString();
                    break;
                } else if (amount && amount.length > 1) {
                    doc.amount = getNumberFromStringStarting(amount[1].trim());
                } else if (status && status.length > 1) {
                    doc.status = status[1].trim() === 'paid' ? 'true' : 'false';
                } else {
                    doc.description += line.trim();
                }
                j++;
            }
            i = j - 1;
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
            category = line.trim();
        }
        if (line.search(/^[0-9]+\./) === 0) {
            const doc = { category };
            doc.title = line.replace(/^[0-9]+\./, '').trim();
            doc.description = '';
            let j = i + 1;
            while (j < i + 6 && j < dataArr.length) {
                const line = dataArr[j];
                const amount = line.split('Amount:'), status = line.split('Status:'), date = line.split('Date:');
                if (date && date.length > 1) {
                    doc.date = new Date(date[1].trim())?.toISOString();
                    break;
                } else if (amount && amount.length > 1) {
                    doc.amount = getNumberFromStringStarting(amount[1].trim());
                } else if (status && status.length > 1) {
                    doc.status = status[1].trim() === 'paid' ? 'true' : 'false';
                } else {
                    doc.description += line.trim();
                }
                j++;
            }
            i = j - 1;
            res.push(doc);
        }
    }
    return res;
}

module.exports.convertInvDataToJson = (dataArr) => {
    const res = [];
    let category = '';
    for (let i = 0; i < dataArr.length; i++) {
        if (!dataArr[i]) continue;
        let line = dataArr[i].replace(/\0/g, '0');
        if (INVESTMENT_CATEGORIES.includes(line.trim())) {
            category = line.trim();
        }
        if (line.search(/^[0-9]+\./) === 0) {
            const doc = { category: category };
            doc.title = line.replace(/^[0-9]+\./, '').trim(); // extracting title
            i += 1; if (i >= dataArr.length) break; // for extracting reference
            line = dataArr[i];
            doc.reference = line.trim();
            i += 2; if (i >= dataArr.length) break; // for extracting status, timePeriod
            line = dataArr[i];
            const time = line.split('Time Period:'), isActive = line.split('Status:');
            if (isActive && isActive.length > 1) { // extracting status
                doc.isActive = isActive[1].trim() === 'Active' ? true : false;
            }
            if (time && time.length > 1) { // extracting timePeriod
                doc.timePeriod = getNumberFromStringStarting(time[1].trim());
            }
            i+=2; if (i >= dataArr.length) break;
            line = dataArr[i];
            if (line.startsWith('Investments:')) {
                const invNum = parseInt(line.split(':')[1]?.trim());
                let j = i + 1;
                doc.investments = [];
                while (j <= i + invNum && j < dataArr.length) {
                    const line = dataArr[j];
                    if (line.startsWith('Returns:')) break;
                    const date = line.split('Date:'), amount = line.split('Amount:'), interest = line.split('Interest:'), invDoc = {};
                    if (date && date.length > 1) {
                        invDoc.date = new Date(date[1].split('Amount:')[0]?.trim())?.toISOString();
                    }
                    if (amount && amount.length > 1) {
                        invDoc.amount = getNumberFromStringStarting(amount[1].trim());
                    }
                    if (interest && interest.length > 1) {
                        invDoc.interest = getNumberFromStringStarting(interest[1].trim());
                    }
                    doc.investments.push(invDoc);
                    j++;
                }
                i = j;
            }
            line = dataArr[i];
            if (line.startsWith('Returns:')) {
                const retNum = parseInt(line.split(':')[1]?.trim());
                let j = i + 1;
                doc.returns = [];
                while (j <= i + retNum && j < dataArr.length) {
                    const line = dataArr[j];
                    if (!line) break;
                    const date = line.split('Date:'), amount = line.split('Amount:'), retDoc = {};
                    if (date && date.length > 1) {
                        retDoc.date = new Date(date[1].split('Amount:')[0]?.trim())?.toISOString();
                    }
                    if (amount && amount.length > 1) {
                        retDoc.amount = getNumberFromStringStarting(amount[1].trim());
                    }
                    doc.returns.push(retDoc);
                    j++;
                }
                i = j - 1;
            }
            res.push(doc);
        }
    }
    return res;
}

const getNumberFromStringStarting = (str) => {
    let tp = '';
    for (let c = 0; c < str.length; c++) {
        if (str[c] !== '.' && (isNaN(str[c]) || isNaN(parseFloat(str[c])))) break;
        tp += str[c];
    }
    return parseFloat(tp);
}