import {
    Wifi,
    Tv,
    TvMinimalPlay,
    Coffee,
    Utensils,
    Refrigerator,
    Microwave,
    Package2,
    Wine,
    Car,
    Zap,
    PawPrint,
    Bath,
    CloudSun,
    Waves,
    Flame,
    Wind,
    Sun,
    Shield,
    Dumbbell,
    Bike,
    Bed,
    Baby,
    Key,
    Lock,
    Trees,
    Laptop,
    Droplets,
    AlarmSmoke,
    HeartPulse,
    Book,
    Gamepad2,
    Sofa,
    Fan,
    Building2,
    Accessibility,
    KeySquare,
    KeyRound,
    CheckSquare,
    Footprints,
    BedDouble,

} from "lucide-react"

export const amenityIcons = {
    // Essentials
    WiFi: <Wifi size={20} />,
    AC: <Wind size={20} />,
    Heating: <Sun size={20} />,
    "Hot water": <Droplets size={20} />,
    Washer: <Package2 size={20} />, // placeholder box icon
    Dryer: <Fan size={20} />,
    Iron: <Package2 size={20} />, // placeholder
    "Hair dryer": <Fan size={20} />,
    Shampoo: <Droplets size={20} />,
    Soap: <Droplets size={20} />,
    Towels: <Sofa size={20} />,
    "Bed linens": <Bed size={20} />,
    Bed: <Bed size={20} />,
    BedDouble: <BedDouble size={20} />,
    Sofa: <Sofa size={20} />,

    // Kitchen & Dining
    Kitchen: <Utensils size={20} />,
    Kitchenette: <Utensils size={20} />,
    Refrigerator: <Refrigerator size={20} />,
    Oven: <Package2 size={20} />, // placeholder
    Stove: <Package2 size={20} />,
    Microwave: <Microwave size={20} />,
    Dishwasher: <Package2 size={20} />,
    "Coffee maker": <Coffee size={20} />,
    Toaster: <Package2 size={20} />,
    "Wine glasses": <Wine size={20} />,
    "Cooking basics": <Utensils size={20} />,
    "Dining table": <Utensils size={20} />,

    // Entertainment & Workspace
    TV: <Tv size={20} />,
    "Smart TV": <TvMinimalPlay size={20} />,
    "Books & reading material": <Book size={20} />,
    "Board games": <Gamepad2 size={20} />,
    "Work Desk": <Laptop size={20} />,

    // Safety
    "Smoke Alarm": <AlarmSmoke size={20} />,
    "Carbon monoxide alarm": <AlarmSmoke size={20} />,
    "Fire extinguisher": <Flame size={20} />,
    "First aid kit": <HeartPulse size={20} />,
    Safe: <Shield size={20} />,

    // Outdoors
    Balcony: <Trees size={20} />,
    Patio: <Trees size={20} />,
    Garden: <Trees size={20} />,
    Terrace: <Trees size={20} />,
    "Outdoor furniture": <Sofa size={20} />,
    "BBQ grill": <Flame size={20} />,
    "Fire pit": <Flame size={20} />,
    Hammock: <Trees size={20} />,
    "Nature View": <Trees size={20} />,
    "Lake Access": <Waves size={20} />,

    // Luxury / Wellness
    "Hot tub": <Bath size={20} />,
    Sauna: <CloudSun size={20} />,
    "Swimming Pool": <Waves size={20} />,
    Gym: <Dumbbell size={20} />,
    Bikes: <Bike size={20} />,

    // Comfort
    Fireplace: <Flame size={20} />,
    "Ceiling fan": <Fan size={20} />,
    "Extra pillows & blankets": <Bed size={20} />,

    // Accessibility
    Elevator: <Building2 size={20} />,
    "Step-free access": <Accessibility size={20} />,
    "Accessible parking": <Car size={20} />,

    // Parking & Transport
    "Free parking": <Car size={20} />,
    "Paid parking": <Car size={20} />,
    "EV charger": <Zap size={20} />,

    // Pet & Family Friendly
    "Pets allowed": <PawPrint size={20} />,
    Crib: <Bed size={20} />,
    "High chair": <Baby size={20} />,
    "Baby bath": <Bath size={20} />,

    // Hosting features
    "Self check-in": <Key size={20} />,
    "Keypad entry": <KeySquare size={20} />,
    Lockbox: <Lock size={20} />,

    // Highlights
    "Furry friends welcome": <PawPrint size={24} />,
    "Walkable area": <Footprints size={24} />,
}



const categories = {
    Essentials: [
        "WiFi",
        "AC",
        "Heating",
        "TV",
        "Smart TV",
        "Safe",
        "Sofa",
        "Bed",
        "Bed Double",
    ],
    Kitchen: [
        "Kitchen",
        "Kitchenette",
        "Coffee maker",
        "Refrigerator",
        "Toaster",
        "Microwave",
        "Wine glasses",
    ],
    Safety: [
        "Smoke Alarm",
        "Carbon monoxide alarm",
        "Fire extinguisher",
        "First aid kit",
    ],
    "Family & Pets": [
        "Crib",
        "High chair",
        "Baby bath",
        "Pets allowed",
    ],
    Outdoors: [
        "Garden",
        "Terrace",
        "Patio",
        "Hammock",
        "Bikes",
        "Free parking",
        "Paid parking",
        "EV charger",
    ],
    "Wellness & Recreation": [
        "Swimming Pool",
        "Hot tub",
        "Sauna",
        "Gym",
        "Fireplace",
    ],
    Other: [
        "Work Desk",
        "Shampoo",
        "Self check-in",
        "Lockbox",
    ],
}

export function AmenitySelector({ amenities, setAmenities }) {
    const toggleAmenity = (amenity) => {
        if (amenities.includes(amenity)) {
            setAmenities(amenities.filter((a) => a !== amenity))
        } else {
            setAmenities([...amenities, amenity])
        }
    }

    return (
        <div className="amenity-section">
            {Object.entries(categories).map(([category, items]) => (
                <div key={category} className="amenity-category">
                    <h3>{category}</h3>
                    <div className="amenity-grid">
                        {items.map((amenity) => (
                            <label
                                key={amenity}
                                className={`amenity-item ${amenities.includes(amenity) ? "selected" : ""
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={amenities.includes(amenity)}
                                    onChange={() => toggleAmenity(amenity)}
                                />
                                <span className="icon">{amenityIcons[amenity] || "✨"}</span>
                                <span className="label">{amenity}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
