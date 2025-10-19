# Lumbridge RPG MVP Design Document

## 1. Game Overview

A single-player, web-based recreation of Old School RuneScape's starting town, Lumbridge. Players can explore the iconic town, complete beginner quests, train skills through various activities (woodcutting, fishing, crafting, combat), and interact with classic NPCs. The game captures the nostalgic isometric view and click-to-move gameplay of early 2000s OSRS.

**Tagline:** "Your first steps in Gielinor, reimagined"

**Languages/Tech:** Python (Pygame) OR JavaScript (Phaser 3 + Next.js)

## 2. Core Mechanics

### Movement & Controls

**Languages/Tech:** Python (Pygame event handling) OR JavaScript (Phaser input system)

- Point-and-click pathfinding (click anywhere on the ground to walk there)
- Isometric tile-based grid system
- Camera: Fixed isometric view (can add rotation later)
- Right-click context menus for interactions

### Combat System

**Languages/Tech:** Python (class-based combat logic) OR JavaScript (Phaser sprites with collision detection)

- Auto-attack melee combat (click enemy to attack)
- Health points system
- Simple damage calculation (your level vs enemy level)
- Death = respawn at Lumbridge Castle

### Skills System (MVP - Focus on these 4)

**Languages/Tech:** Python (skill classes with XP tracking) OR JavaScript (state management with Zustand/Context)

- **Woodcutting:** Click trees, get logs, gain XP
- **Fishing:** Click fishing spots, catch fish, gain XP
- **Crafting:** Spin wool at spinning wheel
- **Combat:** Fight goblins and chickens

### Inventory

**Languages/Tech:** Python (2D list/array) OR JavaScript (React components for UI + game state)

- 28-slot inventory system
- Stackable items (arrows, coins, food)
- Equipment slots (weapon, armor - keep simple for MVP)

### Quests (Start with 2-3)

**Languages/Tech:** Python (quest state machine) OR JavaScript (JSON quest definitions + state tracking)

- **Cook's Assistant** - Gather ingredients for castle cook
- **The Restless Ghost** - Help priest at church
- **Sheep Shearer** - Collect wool for Fred the Farmer

## 3. Town Layout - Lumbridge

**Languages/Tech:** Python (Pygame tilemaps with Tiled Map Editor) OR JavaScript (Phaser Tilemap API with Tiled JSON)

Based on OSRS Lumbridge, your map includes:

### Central Area:

- **Lumbridge Castle** (3 floors)
  - Ground: Kitchen (Cook), Dining hall
  - 1st Floor: Duke Horacio, Spinning wheel
  - 2nd Floor: Bank
- **Lumbridge General Store** (Shopkeeper NPC)
- **Church** (Father Aereck)
- **Graveyard** (quest location)
- **River Lum** with bridge

### North Area:

- **Fred the Farmer's house** (Sheep Shearer quest)
- Sheep pen with shearable sheep

### South/East:

- **Goblin house** (level 2-5 goblins for combat training)
- **Chicken coop** (level 1 chickens)
- **Cow pasture** (level 2 cows, dairy cow for quest)
- **Fishing spots** along River Lum

### West:

- Path to Draynor Village (blocked/grayed out for MVP)

## 4. Key NPCs

**Languages/Tech:** Python (NPC class with dialogue trees) OR JavaScript (NPC objects with dialogue JSON)

### Quest Givers:

- **Duke Horacio** (Castle, 1st floor) - Tutorial dialogue
- **Cook** (Castle kitchen) - Cook's Assistant quest
- **Father Aereck** (Church) - The Restless Ghost quest
- **Fred the Farmer** (Farm) - Sheep Shearer quest

### Merchants:

- **Shopkeeper** (General Store) - Buy/sell basic items
- **Bob** (Bob's Axes) - Sell axes

### Helpers:

- **Lumbridge Guide** (near castle) - Tutorial tips
- **Hans** (Castle courtyard) - Tells you how long you've been playing

## 5. Progression System

**Languages/Tech:** Python (XP calculation functions) OR JavaScript (level calculation utilities)

### Skills:

- XP-based leveling (1-99 scale, but MVP focuses on levels 1-20)
- Each action gives XP (chop tree = 25 XP, etc.)
- Level up = unlock better actions

### Quests:

- Linear quest progression
- Rewards: XP, coins, items
- Quest journal to track progress

### No Complex Systems for MVP:

- No magic/prayer
- No complex crafting recipes
- No trading between players
- No wilderness/PvP

## 6. Technical Scope

### MVP Features (Must Have):

- ✅ Character creation (just name, one default appearance)
- ✅ Point-and-click movement on tile grid
- ✅ 4 trainable skills (Woodcutting, Fishing, Crafting, Combat)
- ✅ 28-slot inventory system
- ✅ 2-3 completable quests
- ✅ 5-8 interactable NPCs
- ✅ Basic combat (goblins, chickens, cows)
- ✅ Shops (buy/sell items)
- ✅ Simple audio (background music, click sounds)

### Phase 2 Features (Post-MVP):

- More quests
- Additional skills
- Save/load system (pickle for Python / localStorage for JavaScript)
- Multiple character classes
- Equipment system expansion
- More areas beyond Lumbridge

## 7. Tech Stack Recommendations

### Option A: Python + Pygame (Recommended for You)

**Why:** You're most comfortable with Python, great for local development

**Stack:**

- **Language:** Python 3.10+
- **Game Engine:** Pygame (2D game library)
- **Map Editor:** Tiled Map Editor (free, exports to Python-compatible formats)
- **Audio:** Pygame mixer
- **Save System:** Python pickle or JSON
- **IDE:** VS Code with Python extension

**Installation:**

```bash
pip install pygame
pip install pytmx  # For Tiled map loading
```

**Pros:**

- You already know Python
- Pygame is beginner-friendly
- Great tutorials for tile-based games
- Easy to debug and iterate

**Cons:**

- Not web-based (desktop only)
- Distribution requires packaging (PyInstaller)

### Option B: JavaScript + Phaser 3 + Next.js

**Why:** Web-based, easy to share online later

**Stack:**

- **Language:** JavaScript/TypeScript
- **Framework:** Next.js 14+
- **Game Engine:** Phaser 3
- **Styling:** Tailwind CSS for UI overlays
- **State Management:** Zustand or React Context
- **Audio:** Howler.js or Phaser's audio system

**Installation:**

```bash
npx create-next-app@latest lumbridge-rpg
npm install phaser
npm install zustand
```

**Pros:**

- Web-based (runs in browser)
- Easy to deploy later (Vercel, Netlify)
- Phaser has excellent tilemap support
- Large community

**Cons:**

- Steeper learning curve if you're new to JS
- More complex setup

## 8. Assets Needed (Free Resources)

**Languages/Tech:** Any image format (PNG, JPG) - works with both Python and JavaScript

### Graphics:

- **Isometric tile sprites** (grass, stone, water, paths)
  - Source: OpenGameArt.org, itch.io (search "isometric tiles")
  - Recommended: Kenney.nl (free isometric asset packs)
- **Character sprite sheets** (walking animations, 8 directions)
  - Source: itch.io "pixel character sprite"
- **NPC sprites** (static or simple animations)
- **Item icons** (28x28 or 32x32 pixels)
- **UI elements** (inventory slots, buttons, dialogue boxes)
  - Source: Kenney.nl UI packs

### Audio:

- **Background music** (medieval/fantasy themes)
  - Source: Incompetech.com, OpenGameArt.org
- **Sound effects** (click, footsteps, combat sounds)
  - Source: Freesound.org, Zapsplat.com

### Tools:

- **Tiled Map Editor** (free) - Create tile-based maps
- **Aseprite** ($20) or **Piskel** (free) - Pixel art editing
- **GIMP** (free) - General image editing

## 9. MVP Development Roadmap

### Week 1-2: Foundation

**Languages/Tech:** Python (Pygame window setup, game loop) OR JavaScript (Next.js + Phaser scene setup)

- Set up development environment
- Create tile grid system
- Implement click-to-move pathfinding (A* algorithm)
- Character movement animation (8-directional sprite)

### Week 3-4: Core Systems

**Languages/Tech:** Python (inventory class, dialogue system) OR JavaScript (React UI components, game state)

- Inventory system (28-slot grid)
- NPC dialogue system (text boxes, choice branches)
- Item pickup/drop mechanics
- One skill implementation (Woodcutting as proof of concept)

### Week 5-6: Content

**Languages/Tech:** Python (Tiled map import, NPC placement) OR JavaScript (Phaser tilemap loading, NPC spawning)

- Build Lumbridge map in Tiled
- Place all NPCs with collision
- Implement 1 full quest (Cook's Assistant)
- Basic combat system (attack, damage, death)

### Week 7-8: Polish

**Languages/Tech:** Python (Pygame UI refinement) OR JavaScript (CSS styling, animations)

- UI/UX improvements (health bars, XP notifications)
- Sound effects & background music
- Bug fixes and playtesting
- Save/load functionality

## 10. Getting Started Checklist

### Before Coding:

- [ ] Choose tech stack (Python + Pygame recommended for you)
- [ ] Install required software (Python, Pygame, Tiled, image editor)
- [ ] Download free asset packs (tiles, characters, items)
- [ ] Sketch out Lumbridge map on paper
- [ ] Create a GitHub repository for version control

### First Coding Session:

- [ ] Set up basic game window (800x600 resolution)
- [ ] Load and display a simple tile grid
- [ ] Implement basic character sprite that can move with arrow keys
- [ ] Add click-to-move on a single tile

## 11. Python + Pygame Specific Notes

### Project Structure:

```
lumbridge-rpg/
├── main.py              # Game entry point
├── settings.py          # Constants (screen size, tile size, colors)
├── assets/
│   ├── images/          # Sprites, tiles, UI
│   ├── maps/            # Tiled .tmx files
│   └── sounds/          # Audio files
├── src/
│   ├── player.py        # Player class
│   ├── npc.py           # NPC class
│   ├── inventory.py     # Inventory system
│   ├── quest.py         # Quest management
│   ├── skills.py        # Skill system
│   └── world.py         # Map loading, collision
└── README.md
```

### Key Libraries:

- `pygame` - Core game engine
- `pytmx` - Load Tiled maps
- `pathfinding` - A* pathfinding for click-to-move

### Learning Resources:

- **Python + Pygame Tutorial:** "Clear Code" on YouTube (tile-based RPG series)
- **Isometric Games in Pygame:** Search "pygame isometric tutorial"
- **Pathfinding:** Red Blob Games (excellent visual explanations)

## 12. Success Metrics for MVP

You'll know your MVP is complete when:

- ✅ Player can walk around Lumbridge map
- ✅ Player can chop a tree and see woodcutting XP increase
- ✅ Player can catch a fish at River Lum
- ✅ Player can fight and kill a goblin
- ✅ Player can complete Cook's Assistant quest
- ✅ Player can buy/sell items at General Store
- ✅ Inventory system works (add/remove items, stacking)
- ✅ Game runs smoothly at 60 FPS

## Final Notes

**Start Small:** Don't try to build everything at once. Get one feature working well before moving to the next.

**Use Version Control:** Commit to Git after each working feature.

**Playtest Often:** Run the game every 30 minutes to catch bugs early.

**Community:** Join game dev communities (r/gamedev, r/pygame, Discord servers) for help.

**Estimated Total Development Time:** 40-60 hours for MVP (assuming 1-2 hours per day)

## Next Steps

1. Install Python and Pygame
2. Download free asset packs (Kenney.nl is a great start)
3. Follow a basic Pygame tutorial to understand the game loop
4. Start building the tile grid system
