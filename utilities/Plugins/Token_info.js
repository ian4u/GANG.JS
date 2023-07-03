// Love from for4. <3	
const request = require('request');
const {getheaders, validateToken, colors, clear} = require('../Settings/common');
const fs = require('fs');

async function Info(token) {
    if(await validateToken(token) === undefined) {return}
    getheaders(token)
    .then((headers_) => {
        const headers = headers_;
        request.get({uri: 'https://discord.com/api/v9/users/@me', headers: headers}, function (error, response, bodyx) {
            if(error) {console.log(colors.red(error))}
            if(response.statusCode!== 200) {console.log(colors.red+"Request failed.")}
            const body = JSON.parse(bodyx)
            const cc_digits = {
              "american express" : 3,
              "visa" : 4,
              "mastercard" : 5,
            }
            var bages = ""
            const D_bages = {
                "Discord_Employee" : 1,
                "Partnered_Server_Owner" : 2,
                "HypeSquad_Events" : 4,
                "Bug_Hunter_Level_1" : 8,
                "House_Bravery" : 64,
                "House_Brilliance" : 128,
                "House_Balance" : 256,
                "Early_Supporter" : 512,
                "Bug_Hunter_Level_2" : 16384,
                "Early_Verified_Bot_Developer" : 131072
              }
              const falgs = body.flags
              if(falgs === D_bages.Discord_Employee) {
                bages += "Discord_Employee, "
              }
              if(falgs === D_bages.Partnered_Server_Owner) {
                bages += "Partnered_Server_Owner, "
              }
              if(falgs === D_bages.HypeSquad_Events) {
                bages += "HypeSquad_Events, "
              }
              if(falgs === D_bages.Bug_Hunter_Level_1) {
                bages += "Bug_Hunter_Level_1, "
              }
              if(falgs === D_bages.House_Bravery) {
                bages += "House_Bravery, "
              }
              if(falgs === D_bages.House_Brilliance) {
                bages += "House_Brilliance, "
              }
            if(falgs === D_bages.House_Balance) {
                bages += "House_Balance, "
              }
              if(falgs === D_bages.Early_Supporter) {
                bages += "Early_Supporter, "
              }
              if(falgs === D_bages.Bug_Hunter_Level_2) {
                bages += "Bug_Hunter_Level_2, "
              }
              if(falgs === D_bages.Early_Verified_Bot_Developer) {
                bages += "Early_Verified_Bot_Developer, "
              }
              
              
              getheaders(token)
              .then((headers_) => {
                request.get({uri: 'https://discordapp.com/api/v9/users/@me/billing/subscriptions', headers: headers_}, function (error, response, body2) {      
                  const name = body.username
                  const userid = body.id
                  const phone = body.phone
                  const email = body.email
                  const email_verified = body.verified
                  const language = body.locale
                  const mfa = body.mfa_enabled
                  const avatar = body.avatar
                  const res = JSON.parse(body2)
                  const nitro_data = res
                  const has_nitro = Boolean(nitro_data.length > 0)
                    const avatar_url = `https://cdn.discordapp.com/avatars/${userid}/${avatar}.webp`

                    var daysLeft;
                    if(has_nitro) {
                        const d1 = new Date(nitro_data[0].current_period_end.split('.')[0])
                        const d2 = new Date(nitro_data[0].current_period_end.split('.')[0])
                        const timeDiff = Math.abs(d2 - d1)
                        daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
                    }

                    function fetchBillingInfo(token) {
                      return new Promise((resolve, reject) => {
                        const headersPromise = getheaders(token);
                        headersPromise
                          .then((headers2) => {
                            request.get(
                              {
                                url: "https://discordapp.com/api/v9/users/@me/billing/payment-sources",
                                headers: headers2,
                              },
                              function (error, response, body2) {
                                if (error) {
                                  reject(error);
                                } else {
                                  const billingInfo = [];
                                  const data = JSON.parse(body2);
                                
                                  for (const x of data) {
                                    const y = x.billing_address;
                                    const name = y.name;
                                    const address_1 = y.line_1;
                                    const address_2 = y.line_2;
                                    const city = y.city;
                                    const postal_code = y.postal_code;
                                    const state = y.state;
                                    const country = y.country;
                                
                                    if (x.type === 1) {
                                      const cc_brand = x.brand;
                                      const cc_first = cc_digits[cc_brand];
                                      const cc_last = x.last_4;
                                      const cc_month = String(x.expires_month);
                                      const cc_year = String(x.expires_year);
                                    
                                      const ccNumber = (cc_first ? cc_first : "*") + ("*" * 11) + cc_last;
                                      const ccExpDate = (cc_month.length < 2 ? "0" + cc_month : cc_month) + "/" + cc_year.slice(2, 4);
                                    
                                      const paymentData = {
                                        "Payment Type": "Credit Card",
                                        Valid: !x.invalid,
                                        "CC Holder Name": name,
                                        "CC Brand": cc_brand.charAt(0).toUpperCase() + cc_brand.slice(1),
                                        "CC Number": ccNumber.match(/.{1,4}/g).join(" "),
                                        "CC Exp. Date": ccExpDate,
                                        "Address 1": address_1,
                                        "Address 2": address_2 || "",
                                        City: city,
                                        "Postal Code": postal_code,
                                        State: state || "",
                                        Country: country,
                                        "Default Payment": x.default,
                                      };
                                  
                                      billingInfo.push(paymentData);
                                    } else if (x.type === 2) {
                                      const paymentData = {
                                        "Payment Type": "PayPal",
                                        Valid: !x.invalid,
                                        "PayPal Name": name,
                                        "PayPal Email": x.email,
                                        "Address 1": address_1,
                                        "Address 2": address_2 || "",
                                        City: city,
                                        "Postal Code": postal_code,
                                        State: state || "",
                                        Country: country,
                                        "Default Payment": x.default,
                                      };
                                  
                                      billingInfo.push(paymentData);
                                    }
                                  }
                              
                                  resolve(billingInfo);
                                }
                              }
                            );
                          })
                          .catch((error) => {
                            reject(error);
                          });
                      });
                    }
                    clear()
                    const info = 
`
####### Account Info ########
> Username      : ${name} | ID: ${userid}
> Bages         : ${bages}
> Language      : ${language}
> Avatar URL    : ${avatar_url}
> Account Token : ${token}

####### Billing Info ########
> Email          : ${email}
> Email Verified : ${email_verified}
> Phone          : ${phone}
> 2 Factor       : ${mfa}

####### Nitro Info ########
> Nitro Account  : ${has_nitro? "Yes" : "No"}
> Expires in     : ${daysLeft? daysLeft + " days" : "No booster"}
`
                    console.log(colors.purple+info+colors.reset);

                    fetchBillingInfo(token)
                    .then(billing_info => {
                        if (billing_info.length > 0) {
                            console.log(`${colors.reset}${colors.lightGreen}####### Billing Info #######${colors.reset}`);
                            if (billing_info.length === 1) {
                              for (const x of billing_info) {
                                for (const [key, val] of Object.entries(x)) {
                                  if (!val) {
                                    continue;
                                  }
                                  console.log(`[${colors.red}${key.padEnd(23)}${colors.reset}] ${val}`);
                                }
                              }
                            } else {
                              for (let i = 0; i < billing_info.length; i++) {
                                const x = billing_info[i];
                                const title = `Payment Method #${i + 1} (${x["Payment Type"]})`;
                                console.log(title);
                                console.log('='.repeat(title.length));
                                for (const [key, val] of Object.entries(x)) {
                                  if (!val || key === "Payment Type") {
                                    continue;
                                  }
                                  console.log(`[${Red}${key.padEnd(23)}${Reset}] ${val}`);
                                }
                                if (i < billing_info.length - 1) {
                                  console.log(`${colors.reset}`);
                                }
                              }
                            }
                            console.log(`${colors.reset}`);
                        }   
                    })
                })
            }) 
        })
    })
}

module.exports = { Info: Info };