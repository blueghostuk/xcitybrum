using System;
using System.Web.Http;
using System.Web.Optimization;
using webapp.App_Start;

namespace webapp
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}