using System.Web.Configuration;
using System.Web.Optimization;

namespace webapp.App_Start
{
    public static class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                "~/Scripts/knockout-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/underscore").Include(
                "~/Scripts/underscore.js"));

            bundles.Add(new ScriptBundle("~/bundles/ratchet").Include(
                "~/Scripts/ratchet.js"));

            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                "~/Scripts/moment.js"));

            bundles.Add(new ScriptBundle("~/bundles/spin").Include(
                "~/Scripts/spin.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/app/lib.js",
                "~/Scripts/app/stations.js",
                "~/Scripts/app/globalKnockout.js",
                "~/Scripts/app/global.js",
                "~/Scripts/app/webApi.js"));

            bundles.Add(new ScriptBundle("~/bundles/app-pages").Include(
                "~/Scripts/app/pages/index.js",
                "~/Scripts/app/pages/station.js",
                "~/Scripts/app/pages/train.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/ratchet.css",
                "~/Content/ratchet-theme-" + WebConfigurationManager.AppSettings["target"] + ".css",
                "~/Content/app/site.css"));
        }
    }
}