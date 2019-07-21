export const removeAccents = (str) => {
    let accents = 'ÀÁÂÃÄÅẠàáâãäåạßÒÓÔÕÕÖỌØòóôõöọøÈÉẼẸÊËẾỄỆèéêëếễệðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    let accentsOut = "AAAAAAAaaaaaaaBOOOOOOOOoooooooEEEEEEEEEeeeeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    str = str.split('');
    str.forEach((letter, index) => {
        let i = accents.indexOf(letter);
        if (i != -1) {
            str[index] = accentsOut[i];
        }
    })
    return str.join('');
}