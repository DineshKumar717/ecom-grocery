import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const InputField = ({ type, placeholder, name, handleChange, value }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-700 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    name={name}
    value={value}
    onChange={handleChange}
    required
  />
);

const Addaddress = () => {
  const { axios, user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    if (user) {
      // Just send address, do NOT send userId
      const { data } = await axios.post("/api/address/add", {
        ...address,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } else {
      toast.error("You must be logged in to add an address.");
      navigate("/login");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Failed to save address");
  }
};


  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="firstName"
                type="text"
                placeholder="First Name"
                value={address.firstName}
                handleChange={handleChange}
              />
              <InputField
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={address.lastName}
                handleChange={handleChange}
              />
            </div>
            <InputField
              name="email"
              type="email"
              placeholder="Email Address"
              value={address.email}
              handleChange={handleChange}
            />
            <InputField
              name="phone"
              type="text"
              placeholder="Phone Number"
              value={address.phone}
              handleChange={handleChange}
            />
            <InputField
              name="street"
              type="text"
              placeholder="Street Address"
              value={address.street}
              handleChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="city"
                type="text"
                placeholder="City"
                value={address.city}
                handleChange={handleChange}
              />
              <InputField
                name="state"
                type="text"
                placeholder="State"
                value={address.state}
                handleChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="zipcode"
                type="text"
                placeholder="Zipcode"
                value={address.zipcode}
                handleChange={handleChange}
              />
              <InputField
                name="country"
                type="text"
                placeholder="Country"
                value={address.country}
                handleChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition uppercase"
            >
              Save Address
            </button>
          </form>
        </div>

        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default Addaddress;
