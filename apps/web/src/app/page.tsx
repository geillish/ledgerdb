async function getAccounts() {
  const response = await fetch("http://127.0.0.1:8000/api/accounts/", {
    cache: "no-store",
  });

  return response.json();
}

export default async function Home() {
  const accounts = await getAccounts();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Accounts</h1>

      <pre>{JSON.stringify(accounts, null, 2)}</pre>
    </main>
  );
}