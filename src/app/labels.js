const labels = {
    names: ['read', 'write', 'create', 'videos', 'podcasts', 'business', 'family'],
    isInExistingLabels: function(currString, fullMatch){    
        let withoutAtSign = currString.split('@');
        let re;
        fullMatch ? re = new RegExp(`^${withoutAtSign[1]}$`, 'i') : re = new RegExp(`^${withoutAtSign[1]}`, 'i');
        return this.names.filter(el => re.test(el));
    }
};

export default labels