import { auth } from "@/auth";
import { getItems } from "@/actions/items";
import { SignInScreen } from "@/components/SignInScreen";
import { WardrobeApp } from "@/components/WardrobeApp";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div id="app">
        <SignInScreen />
      </div>
    );
  }

  const items = await getItems();

  return (
    <div id="app">
      <WardrobeApp
        initialItems={items}
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />
    </div>
  );
}
