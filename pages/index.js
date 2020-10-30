import { useEffect, useState } from "react";
import Router from "next/router";
import Link from "next/link";
import { TweenMax, TimelineLite } from "gsap";
import axios from "axios";
import config from "../config.json";
import styles from "./index.module.scss";

const server = config.server;

export default function Index() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");

  let [progress, updateProgress] = useState(0);

  const createGrubhubAccount = async () => {
    if (
      firstName === "" ||
      lastName === "" ||
      street === "" ||
      city === "" ||
      zipcode === ""
    ) {
      alert("Please fill out all of the fields");
      return;
    }

    if (progress > 0) {
      return;
    }

    const button = document.querySelector(".submit-button");
    const buttonText = document.querySelector(".button-text");
    const loader = document.querySelector(".loader");
    const loaderProgress = document.querySelector(".loader-progress");

    setTimeout(() => {
      const updateLoaderProgress = setInterval(() => {
        if (progress >= 90) {
          clearInterval(updateLoaderProgress);
        } else {
          updateProgress((progress += 1));
        }
      }, 100);
    }, 1250);

    const tl = new TimelineLite();
    tl.to(button, 1, {
      ease: "expo.inOut",
      width: "80%",
      backgroundColor: "rgba(0,0,0,0)"
    })
      .to(buttonText, 1, { ease: "expo.inOut", y: 40, opacity: 0 }, "-=.75")
      .to(
        loaderProgress,
        1,
        { top: "-30px", opacity: 1, ease: "expo.inOut" },
        "-=1"
      )
      .to(loader, 9, {
        width: "90%",
        ease: "linear"
      });

    await axios({
      method: "GET",
      url: `${server}/api/account`,
      params: { firstName, lastName, street, city, state, zipcode }
    })
      .then(res => {
        clearInterval(updateLoaderProgress);

        const user = res.data;
        const queryString = Object.keys(user)
          .map(key => key + "=" + user[key])
          .join("&");

        tl.kill();
        TweenMax.to(loader, 1, { ease: "linear", width: "100%" });
        updateProgress(90);
        const updateLoaderProgress = setInterval(() => {
          if (progress >= 100) {
            clearInterval(updateLoaderProgress);
          } else {
            updateProgress((progress += 1));
          }
        }, 100);

        setTimeout(() => {
          Router.push(`/Account?${queryString}`);
        }, 1050);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    const header = document.querySelector(".transform-header-text");
    let infoHeader = Array.prototype.slice.call(
      document.querySelectorAll(".info-container h1")
    );
    let infoText = Array.prototype.slice.call(
      document.querySelectorAll(".info-container p")
    );
    const links = Array.prototype.slice.call(
      document.querySelectorAll(".info-container a")
    );
    let info = [...infoHeader, ...infoText, ...links];

    let inputs = document.querySelector(".inputs");
    const loader = document.querySelector(".loader-container");

    TweenMax.staggerFrom(
      info,
      1,
      { x: -40, ease: "expo.inOut", opacity: 0 },
      0
    );

    TweenMax.from(inputs, 1, { x: 40, ease: "expo.inOut", opacity: 0 });
    TweenMax.from(loader, 1, { y: 40, ease: "expo.inOut", opacity: 0 });

    TweenMax.to(header, 1, {
      width: 0,
      opacity: 0,
      delay: 1.5,
      ease: "expo.inOut",
      color: "white"
    });
    setTimeout(() => {
      header.innerHTML = "Finesse";
    }, 2500);
    TweenMax.to(header, 1, {
      width: "auto",
      delay: 2.6,
      opacity: 1,
      ease: "expo.inOut",
      color: "#e94560"
    });
  }, []);

  const focusInput = e => {
    const title = e.target.previousElementSibling;
    TweenMax.to(title, 0.5, { opacity: 1, ease: "expo.inOut" });
  };

  const focusBlur = e => {
    const title = e.target.previousElementSibling;
    TweenMax.to(title, 0.5, { opacity: 0, ease: "expo.inOut" });
  };

  return (
    <div className={`${styles[`container`]}`}>
      <div className={`${styles[`info-container`]} info-container`}>
        <div className={`${styles[`header-text`]}`}>
          <h1 className="transform-header-text">Grub</h1>
          <h1>Hub</h1>
        </div>

        <p>{`This tool allows you to save $10 on any GrubHub order. Simply enter your basic details and the application will generate you a promotional code as well as create an account for you. Made by and for hungry college students.`}</p>
        <p>
          <span>Requirements: </span>
          {`You must have a credit/debit card provider which lets you generate a virtual credit/debit card number. Capital One credit cards have a Google Chrome plugin which lets you create a virtual number for each transaction.`}
        </p>
        <a
          href="https://chrome.google.com/webstore/detail/eno%C2%AE-from-capital-one%C2%AE/clmkdohmabikagpnhjmgacbclihgmdje?utm_source=chrome-ntp-icon"
          target="_blank"
        >{`Capital One Plugin`}</a>
        <p>
          <span>Disclaimer: </span>
          {`This is also only for educational purposes. As always, enjoy your meal and have a great day!`}
        </p>
      </div>

      <div className={`${styles[`input-container`]}`}>
        <div className={`${styles[`inputs`]} inputs`}>
          <div className={`${styles[`name`]}`}>
            <div className={`${styles[`first-name`]}`}>
              <p>First Name</p>
              <input
                onFocus={focusInput}
                onBlur={focusBlur}
                placeholder={"First Name"}
                value={firstName}
                onChange={e => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <div className={`${styles[`last-name`]}`}>
              <p>Last Name</p>
              <input
                onFocus={focusInput}
                onBlur={focusBlur}
                placeholder={"Last Name"}
                value={lastName}
                onChange={e => {
                  setLastName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className={`${styles[`street`]}`}>
            <p>Street</p>
            <input
              onFocus={focusInput}
              onBlur={focusBlur}
              placeholder={"Street"}
              value={street}
              onChange={e => {
                setStreet(e.target.value);
              }}
            />
          </div>
          <div className={`${styles[`city`]}`}>
            <p>City</p>
            <input
              onFocus={focusInput}
              onBlur={focusBlur}
              placeholder={"City"}
              value={city}
              onChange={e => {
                setCity(e.target.value);
              }}
            />
          </div>
          <div className={`${styles[`zipcode`]}`}>
            <p>Zip Code</p>
            <input
              onFocus={focusInput}
              onBlur={focusBlur}
              placeholder={"Zipcode"}
              value={zipcode}
              onChange={e => {
                setZipcode(e.target.value);
              }}
            />
          </div>

          <div className={`${styles[`state`]}`}>
            <p>State</p>
            <select
              onFocus={focusInput}
              onBlur={focusBlur}
              value={state}
              onChange={e => {
                setState(e.target.value);
              }}
            >
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
        </div>
        <div className={`${styles[`loader-container`]} loader-container`}>
          <p
            className={`${styles[`loader-progress`]} loader-progress`}
          >{`${progress}%`}</p>
          <div
            onClick={createGrubhubAccount}
            className={`${styles[`submit-button`]} submit-button`}
          >
            <p className="button-text">Get Code</p>
            <div className={`${styles[`loader`]} loader`} />
          </div>
        </div>
      </div>

      <p className={`${styles[`version`]} version`}>{`Version 1.0.0`}</p>
    </div>
  );
}
