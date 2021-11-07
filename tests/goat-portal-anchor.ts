import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GoatPortalAnchor } from "../target/types/goat_portal_anchor";

const { SystemProgram } = anchor.web3;

describe("goat-portal-anchor", () => {
  console.log("🚀 Starting test...");

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .GoatPortalAnchor as Program<GoatPortalAnchor>;

  const baseAccount = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    console.log("📝 Your transaction signature", tx);

    // Fetch data from the account.
    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("👀 GIF Count", account.totalGifs.toString());

    // You'll need to now pass a GIF link to the function!
    await program.rpc.addGif("https://i.imgur.com/JBj7yHj.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    // Call the account.
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("👀 GIF Count", account.totalGifs.toString());

    // Access gif_list on the account!
    console.log("👀 GIF List", account.gifList);
  });
});
