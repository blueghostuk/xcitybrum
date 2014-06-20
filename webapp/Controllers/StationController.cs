using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Http;
using webapp.NationalRail.Darwin;

namespace webapp.Controllers
{
    [RoutePrefix("api")]
    public class StationController : ApiController
    {
        private static readonly AccessToken DarwinToken = new AccessToken
        {
            TokenValue = WebConfigurationManager.AppSettings["darwinToken"]
        };

        [HttpGet]
        [Route("station/{crsCode}/{toCrsCode}")]
        public async Task<IHttpActionResult> GetServices(string crsCode, string toCrsCode, bool to = true)
        {
            using (var darwin = new LDBServiceSoapClient())
            {
                var result = await darwin.GetArrivalDepartureBoardAsync(DarwinToken, 4, crsCode, toCrsCode, to? FilterType.to : FilterType.from, timeOffset: -30, timeWindow: 30);

                if (result == null)
                    return NotFound();

                return Ok(result);
            }
        }

        [HttpGet]
        [Route("services/")]
        public async Task<IHttpActionResult> GetService(string serviceId)
        {
            using (var darwin = new LDBServiceSoapClient())
            {
                var result = await darwin.GetServiceDetailsAsync(DarwinToken, serviceId);

                if (result == null)
                    return NotFound();

                return Ok(result);
            }
        }

    }
}
