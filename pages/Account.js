import Link from "next/link";
import { useState, useEffect } from "react";
import { TweenMax, TimelineLite } from "gsap";
import { BiCopyAlt } from "react-icons/bi";
import styles from "./account.module.scss";

export default function Account(props) {
  const {
    firstName,
    lastName,
    email,
    password,
    street,
    city,
    zipcode,
    state,
    promoCode,
    phoneNumber
  } = props;

  const [clipboardText, setClipboardText] = useState("");

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  }

  function copyToClipboard(value) {
    var text = document.querySelector(`.${value}`).innerText;
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);

    setClipboardText(text);

    const clipboard = document.querySelector(".clipboard");

    TweenMax.to(clipboard, 1, {
      ease: "expo.inOut",
      bottom: "35px",
      opacity: 1
    });

    setTimeout(() => {
      TweenMax.to(clipboard, 0.5, {
        ease: "expo.inOut",
        bottom: "0px",
        opacity: 0
      });
    }, 2000);
  }

  useEffect(() => {
    const account = document.querySelector(".details");
    const instructions = document.querySelectorAll(".instructions div");

    TweenMax.from(account, 1, {
      x: -60,
      opacity: 0,
      ease: "expo.inOut"
    });

    TweenMax.staggerFrom(
      instructions,
      1,
      { opacity: 0, ease: "expo.inOut", x: 50 },
      0.2
    );
  }, []);

  return (
    <div className={`${styles[`container`]}`}>
      <div className={`${styles[`inner-container`]}`}>
        <div className={`${styles[`details`]} details`}>
          <div className={`${styles[`account-header`]} account-header`}>
            <h1>Account Details</h1>
          </div>
          <div className={`${styles[`account`]} account`}>
            <div className={`${styles[`circle`]} ${styles[`circle-1`]}`} />
            <p className={`${styles[`account-hint`]}`}>
              Click on any text to copy it
            </p>
            <div>
              <p>Name</p>
              <p
                className="name"
                onClick={() => {
                  copyToClipboard("name");
                }}
              >
                {`${firstName} ${lastName}`}
              </p>
            </div>
            <div>
              <p>Email</p>
              <p
                className="email"
                onClick={() => {
                  copyToClipboard("email");
                }}
              >
                {`${email}`}
              </p>
            </div>
            <div>
              <p>Password</p>
              <p
                className="password"
                onClick={() => {
                  copyToClipboard("password");
                }}
              >
                {`${password}`}
              </p>
            </div>
            <div>
              <p>Address</p>
              <p
                className="address"
                onClick={() => {
                  copyToClipboard("address");
                }}
              >
                {`${street}, ${city}, ${state} ${zipcode}`}
              </p>
            </div>
            <div>
              <p>Phone Number</p>
              <p
                className="phone"
                onClick={() => {
                  copyToClipboard("phone");
                }}
              >
                {`${formatPhoneNumber(phoneNumber)}`}
              </p>
            </div>
          </div>
          <div className={`${styles[`code`]} code`}>
            <div>
              <p>Promo Code</p>
              <p
                className="code"
                onClick={() => {
                  copyToClipboard("code");
                }}
              >
                {`${promoCode}`}
              </p>
            </div>
          </div>
        </div>
        <div className={`${styles[`instructions`]} instructions`}>
          <div className={`${styles[`instructions-header`]}`}>
            <h1>Instructions</h1>
          </div>
          <div>
            <h2>{`Step 1`}</h2>
            <p>
              {`Go to `}
              <span>
                <a href="https://grubhub.com" target="_blank">
                  GrubHub
                </a>
              </span>
              {` and sign in with the account that was generated for you. Your address and phone number should already be added into your account, but double check `}
              <span>
                <a
                  href="https://www.grubhub.com/account/address"
                  target="_blank"
                >
                  here
                </a>
              </span>
              {` just to be sure. If there is no address present, please create one using the account details we have provided for you.`}
            </p>
          </div>
          <div>
            <h2>{`Step 2`}</h2>
            <p>
              {`Start placing your order. It must be at least $15 before taxes and fees for the promo code to work.`}
            </p>
          </div>
          <div>
            <h2>{`Step 3`}</h2>
            <p>
              {`Once you get to the payment screen enter in your promo code. At this point use your virtual credit/debit card number as the payment method.`}
              <br />
              <span className={`${styles[`important`]}`}>Note: </span>{" "}
              {`You cannot use a debit/credit you have used before. They link each account to a phone number and credit/debit card. Most credit card companies have a plugin or tool that lets you create a virtual number on the spot. If you are confused please read the requirements section on the `}{" "}
              <span>
                <a href="/" target="_blank">
                  home
                </a>
              </span>{" "}
              {`page.`}
            </p>
          </div>
          <div>
            <h2>{`Step 4`}</h2>
            <p>
              {`Once you place your order pay attention to the tracking information. If it gives you a map and shows you the location of your driver then simply look at the map to see when your driver arrives. Since we generated a fake phone number they will not be able to call you. If it does not give you a map, simply call the restaurant and tell them you put the wrong phone number on the order want want to change it.`}
            </p>
          </div>
          <div>
            <h2>{`Video Guide`}</h2>
            <p>{`Coming soon.`}</p>
          </div>
        </div>
      </div>

      <div className={`${styles[`clipboard`]} clipboard`}>
        <p>
          Copied <span>{`${clipboardText}`}</span> to clipboard
        </p>
      </div>
    </div>
  );
}

Account.getInitialProps = async function(context) {
  return context.query;
};
