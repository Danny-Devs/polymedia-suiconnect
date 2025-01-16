// @ts-nocheck

export async function checkNftOwnership({ structType, address })
{
    const query = `
    query {
        sui {
            nfts(
                where: {
                    collection: { slug: { _eq: "${structType}" } }
                    owner: { _eq: "${address}" }
                },
                limit: 1
            ) {
                token_id
            }
        }
    }`;

    const response = await fetch("https://api.indexer.xyz/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-user": atob("dHJhZGVwb3J0Lnh5eg=="),
            "x-api-key": atob("dm1xVnU1ay5mZTAwZjZlMzEwM2JhNTFkODM1YjIzODJlNjgwOWEyYQ=="),
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    return result.data.sui.nfts.length > 0;
}
