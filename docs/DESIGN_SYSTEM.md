# Design System
The approved MO CV landing-page design is the visual reference. Engineering adapts implementation to the approved design, not the reverse.

## Tokens
All repeated visual decisions should move to shared tokens:
- color: brand/background/surface/text/muted/border/success/warning/error
- spacing: 4/8/12/16/24/32/48/64
- radius: small/medium/large/pill
- typography: display/heading/body/label/caption
- elevation: none/low/medium
- motion: fast/normal/reduced-motion behavior

Do not introduce one-off colors or spacing when an existing semantic token fits.

## Components
Prefer shared Button, Input, Select, Textarea, Card, Alert, Modal, Status, Navigation and Resume-section primitives where repetition exists.

## Accessibility
Tokens/components must preserve visible focus, keyboard operation, adequate contrast, semantic labels and RTL/LTR behavior.
