import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Housing() {
  const [rows, setRows] = useState([]);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();


  const load = async () => {
    const params = {};
    if (location) params.location = location;
    if (type) params.type = type;
    if (maxPrice) params.maxPrice = maxPrice;
    if (searchQuery) params.search = searchQuery;
    if (duration) params.duration = duration;

    try {
      const { data } = await api.get("/properties", { params });
      setRows(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      // Set mock data if API fails
      setRows([
        {
          _id: '1',
          title: 'Modern Student Apartment',
          location: 'Melbourne',
          type: 'Apartment',
          price: 520,
          isRented: false
        },
        {
          _id: '2',
          title: 'Shared Room near University',
          location: 'Sydney',
          type: 'Room',
          price: 300,
          isRented: true
        }
      ]);
    }
  };

  useEffect(() => {
    load();
  }, [location, type, maxPrice, duration, searchQuery]); // Added dependencies to re-load on filter change

  const bookmark = async (id) => {
    try {
      await api.post("/bookmarks", { itemType: "PROPERTY", itemId: id });
      alert("Bookmarked!");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Bookmarked!");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="hero-section rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent">
          <div className="absolute top-4 right-4 text-4xl opacity-30">
            🗽🏛️⛪🗼🏛️
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">✈️</span>
            <div>
              <h1 className="text-3xl font-bold">AbroadEase</h1>
              <p className="text-lg text-purple-100">
                Explore your study interests and preferred location.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-100">
            <span className="text-xl">🏠</span>
            <span className="text-xl font-semibold">Housing for Students</span>
          </div>
        </div>
      </div>

      {/* Main Content and Filters Sidebar */}
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">

          {/* Search Bar */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-purple-800">Book your perfect student housing.</h3>
            </div>
            <form onSubmit={handleSearch} className="search-bar flex items-center p-2">
              <span className="text-xl ml-4">🏠</span>
              <input
                type="text"
                placeholder="Search City | Area | University | Neighborhood | Property"
                className="flex-1 border-none outline-none p-3 text-lg bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="btn-secondary mr-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                All Filters
              </button>
            </form>
          </div>

          {/* Filters Sidebar */}
          {showFilters && (
            <div className="filter-card space-y-6">
              <h2 className="text-2xl font-bold text-center">All Filters</h2>

              <div>
                <label className="block text-white font-medium mb-2">Rent range:</label>
                <select className="input text-purple-900" onChange={(e) => setMaxPrice(e.target.value)}>
                  <option value="">Select...</option>
                  <option value="400">$200-400/week</option>
                  <option value="600">$400-600/week</option>
                  <option value="800">$600-800/week</option>
                  <option value="99999">$800+/week</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Duration:</label>
                <select
                  className="input text-purple-900"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option>1 semester</option>
                  <option>1 year</option>
                  <option>2 years</option>
                  <option>Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Location:</label>
                <select
                  className="input text-purple-900"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option>Melbourne</option>
                  <option>Sydney</option>
                  <option>Brisbane</option>
                  <option>Perth</option>
                  <option>Adelaide</option>
                  <option>Canberra</option>
                  <option>Hobart</option>
                  <option>Darwin</option>
                  <option>Uttara</option>
                  <option>Gulshan</option>
                  <option>Dhanmondi</option>
                  <option>Banani</option>
                </select>
              </div>
            </div>
          )}

          {/* Combined Properties List */}
          <div className="grid gap-4">
            {rows.length > 0 ? (
              rows.map((p) => (
                <div key={p._id} className="card-hover flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏠</span>
                    </div>
                    <div>
                      <Link
                        to={`/housing/${p._id}`}
                        className="font-semibold text-purple-800 hover:text-purple-600 text-lg"
                      >
                        {p.title}
                      </Link>
                      <div className="text-purple-600">
                        {p.location} • {p.type} • ${p.price}/week{" "}
                        {p.isRented && <span className="badge ml-2">Rented</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn" onClick={() => bookmark(p._id)}>
                      Bookmark
                    </button>
                    {user?.role === "admin" && (
                      <AdminRowActions id={p._id} onDone={load} />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No properties found. Try adjusting your filters.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminRowActions({ id, onDone }) {
  const del = async () => {
    await api.delete(`/properties/${id}`);
    onDone();
  };
  return (
    <button className="btn" onClick={del}>
      Delete
    </button>
  );
}
function LandownerCreate({ onDone }) {
  const [f, setF] = useState({
    title: "",
    location: "",
    price: "",
    type: "Apartment",
    description: "",
    amenities: "",
    terms: "",
    duration: "1 semester", // Add the new field with a default value
  });
  const create = async (e) => {
    e.preventDefault();
    const payload = {
      ...f,
      price: Number(f.price),
      amenities: f.amenities ? f.amenities.split(",").map((s) => s.trim()) : [],
    };
    await api.post("/properties", payload);
    setF({
      title: "",
      location: "",
      price: "",
      type: "Apartment",
      description: "",
      amenities: "",
      terms: "",
      duration: "1 semester",
    });
    onDone();
  };
  return (
    <div className="card">
      <h3 className="font-semibold text-blue-800 mb-2">
        Landowner: Create Property
      </h3>
      <form onSubmit={create} className="grid md:grid-cols-3 gap-2">
        <input
          className="input"
          placeholder="Title"
          value={f.title}
          onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Location"
          value={f.location}
          onChange={(e) => setF((p) => ({ ...p, location: e.target.value }))}
        />
        <input
          className="input"
          placeholder="Price"
          value={f.price}
          onChange={(e) => setF((p) => ({ ...p, price: e.target.value }))}
        />
        <select
          className="input"
          value={f.type}
          onChange={(e) => setF((p) => ({ ...p, type: e.target.value }))}
        >
          <option>Apartment</option>
          <option>Room</option>
          <option>Studio</option>
        </select>
        {/* Add a select input for duration */}
        <select
          className="input"
          value={f.duration}
          onChange={(e) => setF((p) => ({ ...p, duration: e.target.value }))}
        >
          <option>1 semester</option>
          <option>1 year</option>
          <option>2 years</option>
          <option>Flexible</option>
        </select>
        <input
          className="input md:col-span-2"
          placeholder="Amenities (comma)"
          value={f.amenities}
          onChange={(e) => setF((p) => ({ ...p, amenities: e.target.value }))}
        />
        <textarea
          className="input md:col-span-3"
          rows={3}
          placeholder="Description"
          value={f.description}
          onChange={(e) => setF((p) => ({ ...p, description: e.target.value }))}
        />
        <input
          className="input md:col-span-3"
          placeholder="Terms"
          value={f.terms}
          onChange={(e) => setF((p) => ({ ...p, terms: e.target.value }))}
        />
        <button className="btn md:col-span-3">Create</button>
      </form>
    </div>
  );
}