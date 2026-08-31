import { ColorSwitcher } from "./ColorSwitcher";
import { DesignModeSwitcher } from "./DesignModeSwitcher";

// Two independent, compact controls -- COLOR changes hue only, MODE changes the design
// language only. Deliberately not a settings panel: each is a single click-to-cycle button.
export function AppearanceControls() {
  return (
    <div className="fixed bottom-5 left-5 z-30 flex gap-2 lg:bottom-6 lg:left-6">
      <ColorSwitcher />
      <DesignModeSwitcher />
    </div>
  );
}
