const visited = [];

const query = (select, root = document) => {
    if (root == null) { return null }

    else if (root.className == select) { return root }

    else {
        let result;
        root.childNodes.forEach((node) => {
            if (result) return;
            result = query(select, node);
        })
        return result;
    }
};

const test = query('wrap1');
console.log(test);