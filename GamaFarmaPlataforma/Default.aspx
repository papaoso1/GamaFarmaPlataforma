<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="GamaFarmaPlataforma.Default" %>

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
    <meta charset="utf-8" />
    <title>GamaFarma - Plataforma</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no" />
    <link rel="apple-touch-icon" href="/img/ico/60.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/img/ico/76.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/img/ico/120.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/img/ico/152.png">
    <link rel="shortcut icon" href="/favicon.png" type="image/png" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta content="Plataforma - GamaFarma" name="description" />
    <meta content="papaoso1@gmail.com" name="author" />
    <link href="/assets/plugins/pace/pace-theme-flash.css" rel="stylesheet" type="text/css" />
    <link href="/assets/plugins/bootstrapv3/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="/assets/plugins/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" />
    <link href="/assets/plugins/jquery-scrollbar/jquery.scrollbar.css" rel="stylesheet" type="text/css" media="screen" />
    <link href="/assets/plugins/bootstrap-select2/select2.css" rel="stylesheet" type="text/css" media="screen" />
    <link href="/assets/plugins/switchery/css/switchery.min.css" rel="stylesheet" type="text/css" media="screen" />
    <link href="/pages/css/pages-icons.css" rel="stylesheet" type="text/css">
    <link href="/css/loading.css" rel="stylesheet" type="text/css">
    <link class="main-stylesheet" href="/pages/css/pages.css" rel="stylesheet" type="text/css" />
    <!--[if lte IE 9]>
        <link href="/pages/css/ie9.css" rel="stylesheet" type="text/css" />
    <![endif]-->
    <script type="text/javascript">
        window.onload = function () {
            // fix for windows 8
            if (navigator.appVersion.indexOf("Windows NT 6.2") != -1)
                document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="/pages/css/windows.chrome.fix.css" />';
        }
    </script>
  </head>
  <body class="fixed-header ">
    <div class="login-wrapper ">
      <!-- START Login Background Pic Wrapper-->
      <div class="bg-pic" style="background-color:#000; opacity: 0.75; ">
        <!-- START Background Pic-->
        <img src="/img/photo/home_001.jpg" data-src="/img/photo/home_001.jpg" data-src-retina="/img/photo/home_001.jpg" alt="" class="lazy">
        <!-- END Background Pic -->
        <!-- START Background Caption-->
        <div class="bg-caption pull-bottom sm-pull-bottom text-white p-l-20 m-b-20">
          <h2 class="semi-bold text-white">
					Plataforma GamaFarma</h2>
          <p class="small">
            © GamaFarma
          </p>
        </div>
        <!-- END Background Caption-->
      </div>
      <!-- END Login Background Pic Wrapper-->
      <!-- START Login Right Container-->
      <div class="login-container bg-white">
        <div class="p-l-50 m-l-20 p-r-50 m-r-20 p-t-30 m-t-20 sm-p-l-15 sm-p-r-15 sm-p-t-20">
          <img class="img-responsive" src="/img/brand.png" alt="logo" data-src="/img/brand.png" data-src-retina="/img/brand.png" >
          
          <!-- START Login Form -->
          <form id="form-login" class="p-t-15" method="post"  >
            <!-- START Form Control-->
            <p>&nbsp;</p>
            <div class="form-group form-group-default">
              <label>Usuario</label>
              <div class="controls">
                  <input type="text" id="userPortal" name="userPortal" placeholder="Cuenta de usuario" class="form-control" required>
              </div>
            </div>
            <!-- END Form Control-->
            <!-- START Form Control-->
            <div class="form-group form-group-default">
              <label>Contraseña</label>
              <div class="controls">
                  <input type="password" class="form-control" id="passPortal" name="passPortal" placeholder="Contraseña" required>
              </div>
            </div>
            <!-- START Form Control-->
            <div class="row">
              <div class="col-md-12 no-padding">
                &nbsp;
              </div>
            </div>
            <!-- END Form Control-->
            <button id="btnEntrar" class="btn btn-complete btn-cons m-t-10" type="button">Entrar</button>
          </form>
          <!--END Login Form-->
          <div class="pull-bottom sm-pull-bottom">
            <div class="m-b-30 p-r-80 sm-m-t-20 sm-p-r-15 sm-p-b-20 clearfix">              
              <div class="col-sm-12 no-padding m-t-10">
                <p>
                    <small>
                        Powered by r3Take
                    </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END Login Right Container-->
    </div>
    
    <!-- BEGIN VENDOR JS -->
         


    <script src="/assets/plugins/pace/pace.min.js" type="text/javascript"></script>
    <script src="/assets/plugins/jquery/jquery-1.11.1.min.js" type="text/javascript"></script>
    <script src="/assets/plugins/modernizr.custom.js" type="text/javascript"></script>
    <script src="/assets/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
    <script src="/assets/plugins/bootstrapv3/js/bootstrap.min.js" type="text/javascript"></script>
    <script src="/assets/plugins/jquery/jquery-easy.js" type="text/javascript"></script>
    <script src="/assets/plugins/jquery-unveil/jquery.unveil.min.js" type="text/javascript"></script>
    <script src="/assets/plugins/jquery-bez/jquery.bez.min.js"></script>
    <script src="/assets/plugins/jquery-ios-list/jquery.ioslist.min.js" type="text/javascript"></script>
    <script src="/assets/plugins/jquery-actual/jquery.actual.min.js"></script>
    <script src="/assets/plugins/jquery-scrollbar/jquery.scrollbar.min.js"></script>
    <script type="text/javascript" src="/assets/plugins/bootstrap-select2/select2.min.js"></script>
    <script type="text/javascript" src="/assets/plugins/classie/classie.js"></script>
    <script src="/assets/plugins/switchery/js/switchery.min.js" type="text/javascript"></script>
    <script src="/assets/plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script>
    <script src="/assets/plugins/jquery-validation/js/localization/messages_es.min.js" type="text/javascript"></script>
    <!-- END VENDOR JS -->
    <script src="/pages/js/pages.min.js"></script>
    <script src="/js/core.js"></script>
    <script src="/js/loading.js"></script>
    <script>
        $(function () {
         
            $("#btnEntrar").click(function () {
                login();
             });

            $(document).keypress(function (e) {
                if (e.which == 13) {
                    login();
                }
            });

            $('#userPortal').focus();
        })

        function login()
        {
            var form = $("#form-login");
            form.validate();

            form.validate();
            if (form.valid()) {
                send("#form-login", "2e92c331-5ae3-4001-8111-0ebbe6cc7fc2");
            } else {
                showError("Proporcione sus credenciales de acceso");
            }
        }

    </script>
  </body>
</html>