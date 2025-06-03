"use client";
import { registerDoctor } from "@/services/auth";
import Link from "next/link.js";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../loader";

const SignupForm = () => {
  const [data, setData] = useState({
    name: "",
    mobile: "",
    email: "",
    registrationNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  const [isSubmited, setIsSubmited] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(true);
  const [passwordSection, setPasswordSection] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    email: "",
    password: "",
    rePassword: "",
  });
  const [disablePassword, setDisablePassword] = useState(true);

  useEffect(() => {
    // Check if the password and rePassword fields are not empty
    // and if they are not equal, set disablePassword to true
    // Otherwise, set it to false
    // This will disable the button if the passwords do not match

    if (
      resetPasswordData.password != "" &&
      resetPasswordData.rePassword != "" &&
      resetPasswordData.password !== resetPasswordData.rePassword
    ) {
      setDisablePassword(true);
    } else {
      setDisablePassword(false);
    }
  }, [resetPasswordData]);

  const validateForm = (data) => {
    const errors = {};

    if (!data.name.trim()) errors.name = "Full name is required";

    if (!data.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(data.mobile)) errors.mobile = "Please enter a valid 10-digit mobile number";

    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email address";

    if (!data.registrationNumber.trim()) errors.registrationNumber = "Registration number is required";

    if (!data.password) errors.password = "Password is required";
    else if (data.password.length < 6) errors.password = "Password must be at least 6 characters long";

    if (!data.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match";

    return errors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log(validationErrors)
      return; // Stop submission if errors
    }

    try {
      setLoading(true)
      const result = await registerDoctor(data);

      // Assuming a successful response contains a status that is NOT 'failed'
      if (result.status && result.status.toLowerCase() === 'failed') {
        toast.success("Registration failed")
        return;
      }

      // If no failure, handle success
      toast.success(result.message || "Registration successful! Please login.");
      window.location.href = "/login";

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    finally {
      setLoading(false)
    }
  };


  // Add this handler for the set password form
  const handleSetPassword = (e) => {
    e.preventDefault();
    if (!resetPasswordData.password || resetPasswordData.password !== resetPasswordData.rePassword) {
      alert('Passwords do not match or are empty.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    if (users.find(u => u.email === data.email)) {
      alert('A user with this email already exists.');
      return;
    }
    users.push({
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      registrationNumber: data.registrationNumber,
      password: resetPasswordData.password
    });
    localStorage.setItem('mockUsers', JSON.stringify(users));
    alert('Registration complete! You can now log in.');
    window.location.href = '/login';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      {loading && <Loader />}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center">Sign Up to your account</h1>
      <p className="text-base font-normal mt-2 mb-4 text-center">
        Access your Synapse dashboard and tools
      </p>
      {!isSubmited && (
        <div className="card flex-col w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-semibold">Register</h2>
          <p className="text-base font-normal mb-6">
            Enter your credentials to create your account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="frm-label" htmlFor="name">
                Full Name *
              </label>
              <input
                className={`w-full frm-input focus:outline-none ${errors.name ? 'border-red-500' : ''}`}
                type="text"
                id="name"
                placeholder="First & Last Name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-6">
              <label className="frm-label" htmlFor="Mobile">
                Mobile Number *
              </label>
              <input
                className={`w-full frm-input focus:outline-none ${errors.mobile ? 'border-red-500' : ''}`}
                type="number"
                id="Mobile"
                value={data.mobile}
                onChange={(e) => setData({ ...data, mobile: e.target.value })}
                placeholder="9xxxxxxxxx0"
                required
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
            <div className="mb-6">
              <label className="frm-label" htmlFor="email">
                Email *
              </label>
              <input
                className={`w-full frm-input focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
                type="email"
                id="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="example@synapse.com"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label className="frm-label" htmlFor="registration-number">
                iOS Registration Number *
              </label>
              <input
                className={`w-full frm-input focus:outline-none ${errors.registrationNumber ? 'border-red-500' : ''}`}
                type="number"
                value={data.registrationNumber}
                onChange={(e) =>
                  setData({ ...data, registrationNumber: e.target.value })
                }
                id="registration-number"
                placeholder="543234567"
                required
              />
              {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>}
            </div>

            <div className="mb-6">
              <label className="frm-label" htmlFor="password">
                Password *
              </label>
              <input
                className={`w-full frm-input focus:outline-none ${errors.password ? 'border-red-500' : ''}`}
                type="password"
                id="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="mb-6">
              <label className="frm-label" htmlFor="confirm-password">
                Confirm Password *
              </label>
              <input
                className={`w-full frm-input focus:outline-none ${errors.confirmPassword ? 'border-red-500' : ''}`}
                type="password"
                id="confirm-password"
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <p className="text-sm text-gray-600">
              By signing up, you agree to our Terms of Service and Privacy Policy. We&apos;ll occasionally send you account related emails.
            </p>

            <button className="btn-primary cmnbtn w-full" type="submit">
              Register
            </button>
          </form>
        </div>
      )}
      {isSubmited && !passwordSection && (
        <div className="w-full max-w-md bg-white border border-[#184C3A] rounded-2xl p-8 flex flex-col items-start shadow-sm">
          <div className="mb-4">
            {/* Custom SVG Icon */}
            <svg width="50" height="44" viewBox="0 0 50 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M33.6252 43.9999C32.2969 43.995 31.0047 43.5686 29.9357 42.7826L26.1407 40.0153C25.6698 39.6696 25.1003 39.4832 24.5155 39.4832C23.9307 39.4832 23.3613 39.6696 22.8904 40.0153L19.0954 42.7826C18.114 43.4971 16.9456 43.912 15.7321 43.9768C14.5186 44.0417 13.3124 43.7538 12.26 43.1481C11.2076 42.5424 10.3543 41.6449 9.80398 40.5648C9.25364 39.4848 9.02988 38.2686 9.1599 37.0641L9.66941 32.4053C9.73483 31.8263 9.61228 31.2417 9.31976 30.7373C9.02725 30.2329 8.58019 29.8353 8.04425 29.603L3.74854 27.7114C2.63399 27.2243 1.68593 26.424 1.02022 25.4085C0.354517 24.3929 0 23.2061 0 21.9929C0 20.7798 0.354517 19.5929 1.02022 18.5773C1.68593 17.5618 2.63399 16.7615 3.74854 16.2744L8.04425 14.3829C8.58019 14.1505 9.02725 13.7529 9.31976 13.2485C9.61228 12.7441 9.73483 12.1595 9.66941 11.5805L9.1599 6.92169C9.02988 5.71723 9.25364 4.50104 9.80398 3.42097C10.3543 2.3409 11.2076 1.44346 12.26 0.837736C13.3124 0.232013 14.5186 -0.055906 15.7321 0.00897667C16.9456 0.0738594 18.114 0.48875 19.0954 1.20322L22.8904 3.9705C23.3613 4.31618 23.9307 4.50264 24.5155 4.50264C25.1003 4.50264 25.6698 4.31618 26.1407 3.9705L29.9357 1.20322C30.6115 0.704581 31.3827 0.349397 32.2016 0.159611C33.0205 -0.0301746 33.8698 -0.05053 34.697 0.0998032C35.5419 0.252643 36.3472 0.574255 37.0643 1.0453C37.7813 1.51635 38.3955 2.12709 38.8697 2.84082C39.0012 3.03279 39.093 3.24894 39.1398 3.47665C39.1866 3.70436 39.1875 3.93909 39.1424 4.16714C39.0973 4.3952 39.0071 4.61203 38.8771 4.80499C38.7471 4.99794 38.5798 5.16317 38.3851 5.29103C38.1904 5.4189 37.9721 5.50684 37.7429 5.54974C37.5137 5.59263 37.2783 5.58963 37.0503 5.54089C36.8223 5.49215 36.6063 5.39866 36.4149 5.26587C36.2236 5.13307 36.0606 4.96363 35.9356 4.76741C35.7236 4.4498 35.4493 4.17823 35.1292 3.96904C34.8092 3.75985 34.45 3.61736 34.0733 3.55016C33.7105 3.48348 33.3378 3.49346 32.9791 3.57944C32.6205 3.66543 32.2839 3.8255 31.9913 4.04932L28.1963 6.81661C27.1222 7.60138 25.8252 8.02449 24.4936 8.02449C23.1619 8.02449 21.8649 7.60138 20.7908 6.81661L17.0046 4.04932C16.5743 3.72362 16.0573 3.53151 15.5182 3.49697C14.979 3.46243 14.4416 3.587 13.973 3.85511C13.5045 4.12323 13.1255 4.52301 12.8835 5.00454C12.6415 5.48606 12.5472 6.02799 12.6123 6.56265L13.1218 11.2127C13.2749 12.5285 13.0032 13.8587 12.346 15.01C11.6887 16.1612 10.6804 17.0735 9.46737 17.6143L5.16287 19.5059C4.67497 19.7217 4.26038 20.0741 3.9694 20.5202C3.67841 20.9663 3.52352 21.487 3.52352 22.0192C3.52352 22.5513 3.67841 23.072 3.9694 23.5181C4.26038 23.9643 4.67497 24.3166 5.16287 24.5325L9.46737 26.3715C10.687 26.9048 11.7036 27.8128 12.369 28.9629C13.0343 30.1129 13.3135 31.4449 13.1657 32.7643L12.6562 37.4144C12.5911 37.9491 12.6854 38.491 12.9275 38.9725C13.1695 39.454 13.5484 39.8538 14.017 40.1219C14.4855 40.3901 15.0229 40.5146 15.5621 40.4801C16.1013 40.4455 16.6183 40.2534 17.0485 39.9277L20.8347 37.1605C21.9088 36.3757 23.2058 35.9526 24.5375 35.9526C25.8692 35.9526 27.1662 36.3757 28.2402 37.1605L32.0352 39.9277C32.4655 40.2534 32.9825 40.4455 33.5217 40.4801C34.0608 40.5146 34.5982 40.3901 35.0668 40.1219C35.5354 39.8538 35.9143 39.454 36.1563 38.9725C36.3983 38.491 36.4927 37.9491 36.4275 37.4144L35.918 32.7643C35.7648 31.4508 36.0356 30.1227 36.6912 28.9731C37.3468 27.8234 38.353 26.9121 39.5637 26.3715L43.8682 24.48C44.3561 24.2641 44.7707 23.9117 45.0616 23.4656C45.3526 23.0195 45.5075 22.4988 45.5075 21.9666C45.5075 21.4345 45.3526 20.9138 45.0616 20.4677C44.7707 20.0216 44.3561 19.6692 43.8682 19.4533L41.5314 18.49C41.314 18.4017 41.1164 18.2709 40.9505 18.1052C40.7846 17.9395 40.6538 17.7424 40.5656 17.5254C40.4774 17.3084 40.4338 17.0761 40.4373 16.842C40.4408 16.6079 40.4913 16.3769 40.5858 16.1627C40.6804 15.9484 40.817 15.7552 40.9878 15.5945C41.1585 15.4337 41.3598 15.3088 41.5798 15.2269C41.7999 15.1451 42.0341 15.1081 42.2687 15.118C42.5033 15.128 42.7335 15.1847 42.9458 15.2849L45.2825 16.3095C46.3971 16.7966 47.3451 17.5968 48.0108 18.6124C48.6765 19.6279 49.031 20.8148 49.031 22.0279C49.031 23.2411 48.6765 24.428 48.0108 25.4435C47.3451 26.4591 46.3971 27.2593 45.2825 27.7464L40.9868 29.638C40.4509 29.8712 40.0036 30.2686 39.7098 30.7726C39.416 31.2765 39.2909 31.8607 39.3528 32.4403L39.8624 37.0992C40.0098 38.3049 39.7946 39.5271 39.2441 40.6107C38.6935 41.6944 37.8325 42.5905 36.7701 43.1854C35.8113 43.7264 34.7269 44.0072 33.6252 43.9999Z" fill="#004C44" />
              <path d="M24.7175 28.1228C24.4856 28.123 24.2561 28.0775 24.042 27.9888C23.8279 27.9001 23.6335 27.7701 23.4701 27.6062L15.9064 20.0662C15.7179 19.91 15.5643 19.7162 15.4554 19.4973C15.3465 19.2784 15.2847 19.0392 15.2741 18.7951C15.2635 18.5509 15.3042 18.3073 15.3937 18.0798C15.4832 17.8523 15.6194 17.646 15.7937 17.4741C15.9679 17.3023 16.1763 17.1687 16.4055 17.0819C16.6346 16.9951 16.8795 16.9571 17.1242 16.9703C17.369 16.9835 17.6083 17.0476 17.8267 17.1585C18.0451 17.2693 18.2379 17.4246 18.3925 17.6142L24.7175 23.9194L47.0657 1.60592C47.4004 1.30461 47.8386 1.14317 48.2895 1.15503C48.7403 1.16688 49.1693 1.35112 49.4877 1.6696C49.806 1.98808 49.9893 2.4164 49.9996 2.86589C50.0099 3.31537 49.8464 3.75159 49.543 4.08422L25.9561 27.5974C25.7944 27.7619 25.6018 27.8929 25.3893 27.9831C25.1767 28.0732 24.9485 28.1207 24.7175 28.1228Z" fill="#004C44" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#184C3A] mb-2">
            Thank You! Registration request has been submitted
          </h2>
          <p className="text-[#184C3A]">
            Once your information has been approved by the admin, you can set up your password.
          </p>
        </div>
      )}
      {passwordSection && (
        <div className="card flex-col w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-semibold">Login</h2>
          <p className="text-base font-normal mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSetPassword}>
            <div className="mb-6">
              <label className="frm-label" htmlFor="email">
                Email
              </label>
              <input
                className="w-full frm-input focus:outline-none"
                type="email"
                id="email"
                value={resetPasswordData.email}
                onChange={(e) =>
                  setResetPasswordData({
                    ...resetPasswordData,
                    email: e.target.value,
                  })
                }
                placeholder="example@synapse.com"
                required
                disabled
              />
            </div>

            <div className="mb-6">
              <label className="frm-label" htmlFor="password">
                Password
              </label>
              <input
                className="w-full frm-input focus:outline-none"
                type="password"
                id="password"
                value={resetPasswordData.password}
                onChange={(e) =>
                  setResetPasswordData({
                    ...resetPasswordData,
                    password: e.target.value,
                  })
                }
                placeholder="● ● ● ● ● ● ● ●"
                required
              />
            </div>

            <div className="mb-6">
              <label className="frm-label" htmlFor="re-password">
                Re-type Password
              </label>
              <input
                className="w-full frm-input focus:outline-none"
                type="password"
                id="re-password"
                value={resetPasswordData.rePassword}
                onChange={(e) =>
                  setResetPasswordData({
                    ...resetPasswordData,
                    rePassword: e.target.value,
                  })
                }
                placeholder="● ● ● ● ● ● ● ●"
                required
              />
            </div>

            <button
              className="btn-primary cmnbtn w-full"
              type="submit"
              disabled={disablePassword}
            >
              set Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
