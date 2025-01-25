import { MdAccountCircle } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import { PiSignOutBold, PiSignInBold } from "react-icons/pi";
import "./profile.css";
import { NavLink } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

const Profile = () => {
  const { user, removeUser } = useUser();

  return (
    <div className="profile">
      <div className="profile__main">
        <MdAccountCircle className="profile__main__icon" />{" "}
        {user ? user.name : "My Account"}
      </div>
      <div className="profile__options">
        {!user ? (
          <>
            <NavLink to="/signup" className="profile__options__link">
              <FaWpforms /> Sign Up
            </NavLink>
            <NavLink to="/signin" className="profile__options__link">
              <PiSignInBold /> Sign In
            </NavLink>
          </>
        ) : (
          <div className="profile__options__link signout" onClick={removeUser}>
            <PiSignOutBold /> Sign Out
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
