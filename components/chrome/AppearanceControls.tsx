import { ColorSwitcher } from "./ColorSwitcher";

export function AppearanceControls() {
  return (
    <div className="fixed bottom-5 left-5 z-30 flex gap-2 lg:bottom-6 lg:left-6">
      <ColorSwitcher />
    </div>
  );
}
