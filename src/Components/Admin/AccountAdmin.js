import { useState, useEffect } from "react";
import { authenticatedFetch } from "../../utils/api";
import SearchBar from "../SearchBar";

// To clarify purpose, this is designed to fetch all accounts and offer their deletion on the ADMIN page
function AccountAdmin({ setError }) {
  const [openAccounts, setOpenAccounts] = useState(true);
  const [accounts, setAccounts] = useState([]); // State to hold the list of accounts
  const [searchedAccounts, setSearchedAccounts] = useState([]);

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  //   Gets the accounts on mount
  useEffect(() => {
    (async () => {
      try {
        const accountData = await authenticatedFetch(
          `/admin/accounts?accountID=${localStorage.getItem("userId")}`,
          {
            method: "POST",
          }
        );
        setAccounts(
          accountData.filter((acc) => acc.id !== localStorage.getItem("userId"))
        );
        setSearchedAccounts(
          accountData.filter((acc) => acc.id !== localStorage.getItem("userId"))
        );
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setLocalError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [setError]);

  //   Delete Account
  const deleteAccount = async (account, index) => {
    try {
      await authenticatedFetch("/account-mgr/delete", {
        method: "DELETE",
        data: [localStorage.getItem("userId"), account.id],
      });
      setAccounts((prevAccounts) => prevAccounts.filter((_, i) => i !== index));
      setSearchedAccounts((prevAccounts) =>
        prevAccounts.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      setError(error.message, "deleting account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <button
        className={`p-2 bg-[#746056] text-white ${
          openAccounts ? "rounded-t-lg" : "rounded-lg"
        }`}
        onClick={() => setOpenAccounts(!openAccounts)}
      >
        {openAccounts ? "Hide" : "Show"} accounts
      </button>
      {openAccounts && (
        <div className="rounded-b-lg bg-[#F4EFE9] px-2 w-full">
          {accounts.length > 0 && !loading && (
            <SearchBar
              list={accounts}
              setModifiedList={setSearchedAccounts}
              modifier={"username"}
            />
          )}
          {loading ? (
            <p>Loading...</p>
          ) : localError ? (
            <p className="p-2">
              Error fetching accounts. Please try again later.
            </p>
          ) : searchedAccounts.length > 0 ? (
            searchedAccounts.map((account, index) => (
              <>
                {/* Card for each account */}
                <div
                  className="flex flex-row w-full justify-between items-center p-1 h-10"
                  key={index}
                >
                  <div className="w-[40%] overflow-auto no-scrollbar whitespace-nowrap">
                    <p>{account.username}</p>
                  </div>
                  <div className="w-[30%] overflow-auto no-scrollbar whitespace-nowrap text-start p-4">
                    <p>Role: {account.role}</p>
                  </div>
                  <div className="flex w-[30%] justify-end items-center">
                    <button
                      className="bg-red-500 text-white rounded px-2 w-[75px]"
                      onClick={() => deleteAccount(account, index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div
                  className={`border-b ${
                    index === account.length - 1 ? "" : "border-gray-400 pt-1"
                  } w-full`}
                />
              </>
            ))
          ) : (
            <p className="p-2">No accounts found. Please login again.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountAdmin;
