import { auth } from "@/auth";
import { getOutfits } from "@/actions/outfits";
import { SignInScreen } from "@/components/SignInScreen";
import { OutfitsGallery } from "@/components/OutfitsGallery";

export default async function OutfitsPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div id="app">
        <SignInScreen />
      </div>
    );
  }

  const outfits = await getOutfits();

  return (
    <div id="app">
      <OutfitsGallery
        initialOutfits={outfits}
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />
    </div>
  );
}
