using r3Take.IO;
using System;
using System.Web;
using System.Web.SessionState;

namespace GamaFarmaPlataforma.sys
{
    public class UploadHandler : IHttpHandler, IRequiresSessionState
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
                case "GET":
                case "DELETE":
                    if (context.Request["uidRep"] != null && context.Request["uidRef"] != null)
                    {
                        context.Response.ClearHeaders();
                        context.Response.StatusCode = 200;
                        WebFile.deleteFromRef(context);
                    }
                    else
                    {
                        context.Response.ClearHeaders();
                        context.Response.StatusCode = 403;
                    }
                    break;
                case "POST":
                case "PUT":
                    if (context.Request["uidRep"] != null)
                    {
                        Guid uidRep = Guid.Empty;

                        if (Guid.TryParse(context.Request["uidRep"], out uidRep))
                        {
                            context.Response.ClearHeaders();
                            context.Response.StatusCode = 200;
                            context.Response.Write(WebFile.upload(context).ToString());
                        }
                        else
                        {
                            context.Response.ClearHeaders();
                            context.Response.StatusCode = 403;
                        }
                    }
                    else
                    {
                        context.Response.ClearHeaders();
                        context.Response.StatusCode = 403;
                    }
                    break;

                default:
                    context.Response.ClearHeaders();
                    context.Response.StatusCode = 403;
                    break;
            }
        }

    }
}