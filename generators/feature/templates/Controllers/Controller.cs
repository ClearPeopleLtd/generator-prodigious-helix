using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using <%= solutionName %>.Feature.<%= featureTitle %>.Repositories;

namespace <%= solutionName %>.Feature.<%= featureTitle %>.Controllers
{

	public class <%= featureTitle %>Controller : Controller
	{
		private readonly I<%= featureTitle %>Repository <%= featureTitle.toLowerCase() %>Repository;

		public NewsController() : this(new <%= featureTitle %>Repository())
		{
		}

		public NewsController(I<%= featureTitle %>Repository <%= featureTitle.toLowerCase() %>Repository)
		{
			this.<%= featureTitle.toLowerCase() %>Repository = <%= featureTitle.toLowerCase() %>Repository;
		}
	}


}