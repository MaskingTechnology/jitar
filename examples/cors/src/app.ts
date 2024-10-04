
try
{
    const result = await fetch(`http://localhost:3000/rpc/server/serve`);
    alert(await result.text());
}
catch (error: unknown)
{
    alert(error);
}

export {};
