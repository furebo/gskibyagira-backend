const msg = 'Please click the link below to verify your email';
const act = 'Verify Email now';

export const template = (firstname, token, message = msg, action = act) => {
  const link = token ? `https://gskibyagira-backend.onrender.com/api/users/verifyuser/${token}` : "https://gskibyagiraburuhukiro.netlify.app/login";
  return `<head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Reset Password</title>
      <style>
          body {
              background: #f2f2f2;
          }
          section {
              font-family: proxima-nova, sans-serif;
              margin: auto;
              width: 60%;
          }
          .small_text {
              font-size: 16px;
              margin-top: 30px;
              color: #424242;
          }
          .body_par {
              color: #333;
          }
          .login_body li {
              list-style: none;
          }
          .login_body li {
              color: #333;
          }
          a {
              text-decoration: none;
          }
          .footer_text {
              font-size: 15px;
              margin-top: 20px;
              color: #333;
          }
          footer {
              margin-top: 35px;
              color: #222;
              font-size: 15px;
              margin-bottom: 25px;
          }
          footer p {
              line-height: 1.7;
          }
          .logo_img {
              width: 100%;
          }
          .verify_button {
              background-color: #84bb45;
              color: #ffffff;
              padding: 5px 20px;
              font-size: 16px;
              border-radius: 10px;
              font-weight: bold;
              text-transform: capitalize;
              text-align: center;
          }
          @media screen and (max-width: 812px) {
              section {
                  width: 95%;
              }
              .small_text {
                  font-size: 14px;
                  margin-top: 40px;
              }
              .footer_text {
                  font-size: 13px;
              }
              .tuner_logo {
                  height: 280px;
              }
              .tuner_logo img {
                  margin-top: 70px;
                  width: 200px;
              }
              .logo_img {
                  width: 60%;
                  margin: auto;
              }
          }
      </style>
  </head>
  
  <body>
      <section>
          <h2>Confirm Your Email</h2>
          <div class="small_text">
              <p>
                  <strong>Hello, ${firstname}</strong>
              </p>
          </div>
          <div class="body_par">
              <p>
                  ${message}
              </p>
          </div>
          <a href="<%= resetBody %>">
              <div class="verify_button">
                   <a href=${link} style="font-size:15px;">${action}</a>
              </div>
          </a>
          <p class="footer_text">
              If you encounter any problem, please don't hesitate to CONTACT US at
              <span style="color:#424242"><a href="gskibyagira@gmail.com">gskibyagira@gmail.com</a></span>
          </p>
          <footer>
              <p>
                  <span>Kigali, Rwanda</span><br />
                  <span><b> (+250) 783323950</b></span><br />
              </p>
              &copy; GS Kibyagira Buruhukiro - All Rights Reserved.
          </footer>
      </section>
  </body> 
  `
} 
