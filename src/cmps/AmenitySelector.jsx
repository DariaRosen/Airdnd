import {
    Wifi,
    Tv,
    Coffee,
    Utensils,
    Refrigerator,
    Car,
    PawPrint,
    Bath,
    Flame,
    Wind,
    Sun,
    Shield,
    Dumbbell,
    Bike,
    Bed,
    Baby,
    Waves,
    Key,
    Lock,
    Trees,
    Laptop,
    Zap,
    CloudSun,
    Droplets,
    Wine,
    Package2,
    Microwave,
    Briefcase,
    AlarmSmoke,
    HeartPulse,
} from "lucide-react"

const amenityIcons = {
    WiFi: <Wifi size={20} />,
    TV: <Tv size={20} />,
    "Smart TV": <Tv size={20} />,
    "Coffee maker": <Coffee size={20} />,
    Kitchen: <Utensils size={20} />,
    Kitchenette: <Utensils size={20} />,
    Refrigerator: <Refrigerator size={20} />,
    Microwave: <Microwave size={20} />,
    Toaster: <Package2 size={20} />, 
    "Wine glasses": <Wine size={20} />,
    "Free parking": <Car size={20} />,
    "Paid parking": <Car size={20} />,
    "EV charger": <Zap size={20} />,
    "Pets allowed": <PawPrint size={20} />,
    "Hot tub": <Bath size={20} />,
    Sauna: <CloudSun size={20} />,
    "Swimming Pool": <Waves size={20} />,
    Fireplace: <Flame size={20} />,
    AC: <Wind size={20} />,
    Heating: <Sun size={20} />,
    Safe: <Shield size={20} />,
    Gym: <Dumbbell size={20} />,
    Bikes: <Bike size={20} />,
    Crib: <Bed size={20} />,
    "High chair": <Baby size={20} />,
    "Baby bath": <Bath size={20} />,
    "Self check-in": <Key size={20} />,
    Lockbox: <Lock size={20} />,
    Garden: <Trees size={20} />,
    Hammock: <Trees size={20} />,
    Terrace: <Trees size={20} />,
    Patio: <Trees size={20} />,
    "Work Desk": <Laptop size={20} />,
    Shampoo: <Droplets size={20} />,
    "Smoke Alarm": <AlarmSmoke size={20} />,
    "Carbon monoxide alarm": <AlarmSmoke size={20} />,
    "Fire extinguisher": <Flame size={20} />,
    "First aid kit": <HeartPulse size={20} />,
}


const categories = {
    Essentials: [
        "WiFi",
        "AC",
        "Heating",
        "TV",
        "Smart TV",
        "Safe",
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
