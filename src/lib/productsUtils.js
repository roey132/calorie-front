
export async function loadUserProducts() {
    let res = await fetch('/rust/api/products/user');
    if (!res.ok) {
        console.error(`Error: ${res.status} ${res.statusText}`);
        const errorText = await res.text();
        console.error(`Error response: ${errorText}`);
        return res.status;
    }

    let userProducts = await res.json();

    for (let [key, value] of Object.entries(userProducts)) {
        userProducts[key]['isSystem'] = false;
    }
    return userProducts;
}

export async function loadSystemProducts() {
    let res = await fetch('/rust/api/products/system');
    if (!res.ok) {
        console.error(`Error: ${res.status} ${res.statusText}`);
        const errorText = await res.text();
        console.error(`Error response: ${errorText}`);
        return res.status;
    }

    let systemProducts = await res.json();

    for (let [key, value] of Object.entries(systemProducts)) {
        systemProducts[key]['isSystem'] = true;
    }

    return systemProducts;
}

export function sortKeysByName(objectToSort) {
    if (Object.keys(objectToSort).length === 0) {
        return [];
    }
    let sortedKeys = Object.keys(objectToSort).sort((key1, key2) => {
        return objectToSort[key1].product_name.localeCompare(objectToSort[key2].product_name);
    });
    return sortedKeys
}

export function filterSystemProducts(products, showSystem) {
    if (showSystem) {
        return { ...products };
    }
    let filteredProducts = Object.fromEntries(
        Object.entries(products).filter(([id, product]) => product.isSystem === false)
    );
    return filteredProducts;
}


function validateStringSearch(productName, searchValue) {
    let queryWords = searchValue.toLowerCase().split(' ');
    let nameWords = productName.toLowerCase().split(/[\s,]+/);

    return queryWords.every((word) => nameWords.some((nameWord) => nameWord.includes(word)));
}

export function filterProductsSearch(products, query) {
    if (query === '') {
        return { ...products };
    }
    let filteredEntries = Object.entries(products).filter(([id, product]) =>
        validateStringSearch(product.product_name, query)
    );
    let filteredProducts = Object.fromEntries(filteredEntries);

    return filteredProducts;
}
