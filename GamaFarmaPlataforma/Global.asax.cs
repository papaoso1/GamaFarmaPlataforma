using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using r3Take.Web;

namespace GamaFarmaPlataforma
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {

        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Application_PostAcquireRequestState(Object sender, EventArgs e)
        {
            HttpContext hc = HttpContext.Current;
            string path = hc.Request.Path;

            if (!path.EndsWith(".aspx") && !path.EndsWith(".ashx"))
            {
                urlRequest myRequest = new urlRequest(hc);

                if (myRequest.resultPath.LastIndexOf(".aspx") < 0 && myRequest.resultPath.LastIndexOf(".ashx") < 0)
                {
                    Router.manageURLFriendly(myRequest, hc);
                }
                else
                {
                    hc.RewritePath(myRequest.resultPath, false);
                }

            }
        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}