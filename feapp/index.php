<!DOCTYPE html>
<html lang="fr">
    <head>
        <title>Cours de Musique</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no">
        <meta name="handheldfriendly" content="true">
        <meta name="mobileoptimized" content="320">
        <meta http-equiv="cleartype" content="on">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-title" content="Cours de Musique">
        <meta name="robots" content="noindex, nofollow"/>

        <!-- INCLUDING CSS INJECTION -->
        <?php include 'dev/css_partial.html'; ?>

        <!-- JS detection for setting html class as "js" or "no-js" -->
        <script>(function(e) { e.className = e.className.replace(/\bno-js\b/,'js'); })(document.documentElement);</script>

        <!--  JS detection for touch devices - adds "touch" or "no-touch" to the html element -->
        <script>(function(w, d) {
            var hasTouch = ('ontouchstart' in w) || w.DocumentTouch && d instanceof DocumentTouch;
            d.documentElement.className += ' ' + (hasTouch ? 'touch' : 'no-touch');
        })(window, document);</script>

    </head>

    <body ng-app="app">
        <div>
            <base href="/"></base>
            
            <header class="header header--default header--big">
                <div class="container t_padding-vertical-xs-4">

                    <div class="row">
                        <div class="col-xs-2">
                            <img class="logo pull-left t_margin-right-xs-4" src="images/logo_guitar.png">
                            <div class="pull-left">
                                <p>Cours-guitare-facile.com</p>
                                <p>La guitare accessible à tous.</p>
                            </div>
                        </div>

                        <div class="col-xs-4" id="mainNav">
                            <a href="#" class="button-musique t_margin-right-xs-4 anchor is-active">
                                <span class="text-anchor">Accueil</span>
                            </a>
                            <a href="#" class="button-musique t_margin-right-xs-4 anchor">Nos Cours</a>
                            <a href="#" class="button-musique t_margin-right-xs-4 anchor">Instruments</a>
                            <a href="#" class="button-musique t_margin-right-xs-4 anchor">Notre offre</a>

                            <button class="button-main">Me connecter</button>
                        </div>
                    </div>

                    <!-- INCLUDE ANGULAR DIRECTIVE FOR COOKIES -->
                    <cookies-notification policy-link = "This site uses cookies"></cookies-notification>

                </div>
            </header>




            <div class="img-fullbleed">
                <img src="images/big_image_fullbleed_guitars.jpg" class="img-responsive"/>
            </div>
            



            <div class="main-content">
                <div class="container">
                    <div class="row">
                        <div class="col-xs-2">
                            <img src="images/round_icon_clock.png" class="pull-left"/>
                            <p class="clearfix">Apprenez quand vous voulez</p>
                            <p>
                                Profitez d'un acces libre et ilimite a votre espace personnel. Vous pourrez ainse
                               consulter vos ebooks n'importe ou et n'importe quad.
                            </p>
                        </div>
                        <div class="col-xs-2">
                            <img src="images/round_icon_display.png" class="pull-left"/>
                            <p class="clearfix">Disponible sur tous vos ecrans</p>
                            <p>
                                Accedez a votre espace personnel et telechargez vos ebooks de cours de guitarre
                                depuis votre PC, Mac, tablette ou smartphone.
                            </p>
                        </div>
                        <div class="col-xs-2">
                            <img src="images/round_icon_chat.png" class="pull-left"/>
                            <p class="clearfix">Vos outils pedagogiques</p>
                            <p>
                                Apprenez a travers des cours complets et des exercices pratiques adaptes a votre
                                niveau. Les cours sont composes de tablatures afin d'etre accessibles a tous.
                            </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6"><h3>Cours populaires</h3></div>
                    </div>
                    <div class="row">
                        <div class="col-xs-3 text-center">
                            <div class="">
                                <img src="images/guitar_accoustique.png" />
                                <p>Cours de Guitare Acoustique</p>
                                <div class="">
                                    <button class="button-discover">DÉCOUVRIR CE COURS</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-3 text-center">ONE</div>
                    </div>
                    <div class="row">
                        <div class="col-xs-3">
                            <h3>Une pedagogie adaptee a tous</h3>
                            <p>
                                Des cours complets et progressifs pour les debutants. Vous pourrez jouer rapidement vos primiers 
                                morceaux tout en apprenant led fundamentaux.
                                Des cours de perfectionnement pour les plus experimentes. Vous voulez aborder un nouveau style ou
                                vous perfectionner? Les professeurs qui ont composes les cours vous devoilent des techniques, 
                                truc es astuces. Vous trouverez aussi des tablatures adaptees a votre niveau.
                                Choisissez le style qui vous correspond et progressez efficacement grace a notre methode pedagogique!
                            </p>
                        </div>

                        <div class="col-xs-3 text-center">
                        <img src="images/guitar_girl.png"/>
                        </div>
                    </div>
                </div>
            </div>
            



            <footer>
                <div class="container-fluid top-footer top-footer--default top-footer--big">
                    <div class="container">
                        <div class="row">

                            <div class="col-xs-1">
                                <span class="">Paiement sécurité</span>
                            </div>

                            <div class="col-xs-2 text-center">
                                <div class=""><img src="images/logo_piano.png" class="pull-left" /></div>
                                <div class="">Cours de Piano</div>
                                <div class="">Cours Basse</div>
                                <div class="">Cours Batterie</div>
                            </div>

                            <!--span class="">Cours de Musique</span>
                            <span class="">Cours de Guitare</span-->

                            <div class="col-xs-3 text-right">
                                <div class="row">
                                    <button class="button-inscrivez">INSCRIVEZ VOUS</button>
                                </div>
                                <div>
                                    <span class="">Accès illimité à les cours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container text-center">
                    <div class="row">
                        <div class="col-xs-6">
                            <a class="">Mention légale</a>
                            <a class="">Conditions générales de vente</a>
                            <a class="">Qui sommes nous?</a>
                        </div>
                    </div>
                </div>
            </footer>
            
        </div>
    </body>

    <!-- INCLUDING JS INJECTION -->
    <?php include 'dev/spa.js.html'; ?>

</html>

