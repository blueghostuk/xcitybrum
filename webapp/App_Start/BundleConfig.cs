using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/app/lib.js",
                "~/Scripts/app/stations.js",
                "~/Scripts/app/globalKnockout.js",
                "~/Scripts/app/global.js"));

            bundles.Add(new ScriptBundle("~/bundles/app-pages").Include(
                "~/Scripts/app/pages/index.js",
                "~/Scripts/app/pages/station.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/ratchet.css",
                "~/Content/ratchet-theme-ios.css",
                "~/Content/app/site.css"));
        }
    }
}