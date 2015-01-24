<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Yggrdassil - Login</title>

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    
<link rel="stylesheet" type="text/css" href="<c:url value="css/app.css"/>">

<link >

</head>
<body>
  <h3>Login</h3>
  <form name="f" action="<c:url value='/login' />" method="post">
    <input type="text" id="username" name="username" placeholder="Username" />
    <input type="password" id="password" name="password" placeholder="Password" /> 
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
      
    <button type="submit" class="btn btn-default">Log in</button>
  </form>

  <c:if test="${null != param.error}">
    <div>Invalid username and password.</div>
  </c:if>
  <c:if test="${null != param.logout}">
    <div>You have been logged out.</div>
  </c:if>
</body>
</html>
