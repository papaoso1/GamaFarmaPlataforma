using r3Take.IO;
using System;
using System.Web;
using System.Web.SessionState;

namespace GamaFarmaPlataforma.sys
{
    public class dh : IHttpHandler, IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.AddHeader("Pragma", "no-cache");
            context.Response.AddHeader("Cache-Control", "private, no-cache");
            HandleMethod(context);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        private static void HandleMethod(HttpContext context)
        {
            switch (context.Request.HttpMethod)
            {

                case "HEAD":
                case "DELETE":
                    context.Response.ClearHeaders();
                    context.Response.StatusCode = 403;
                    break;
                case "GET":
                    Guid uid = Guid.Empty;

                    if (Guid.TryParse(context.Request["uid"], out uid))
                    {
                        if (uid != Guid.Empty)
                            WebFile.download(context);
                    }
                    break;
                case "POST":
                case "PUT":
                    context.Response.ClearHeaders();
                    context.Response.StatusCode = 403;
                    break;
                default:
                    context.Response.ClearHeaders();
                    context.Response.StatusCode = 403;
                    break;
            }
        }
    }
}