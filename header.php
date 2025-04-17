 <!-- Left Panel -->
 <aside id="left-panel" class="left-panel">
        <nav class="navbar navbar-expand-sm navbar-default">

            <div class="navbar-header">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fa fa-bars"></i>
                </button>
                <a class="navbar-brand" href="./"><img src="images/logo.png" alt="Logo" style="margin-top: 5px; margin-bottom: 10px;"></a>
            </div>

            <?php
                function navActive($page) {
                    return basename($_SERVER['PHP_SELF']) == $page ? 'nav-active' : '';
                }
            ?>

            <div id="main-menu" class="main-menu collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <h3 class="menu-title">Formularios</h3><!-- /.menu-title -->
                    <li class="<?= navActive('formulario_fifo.php') ?>">
                        <a href="formulario_fifo.php" style="margin-left: 5px;">Formulario FIFO</a>
                    </li>

                    <h3 class="menu-title">Control Admin</h3><!-- /.menu-title -->
                    <li class="<?= navActive('admin.php') ?>">
                        <a href="admin.php">Control Admin</a>
                    </li>
                </ul>
            </div><!-- /.navbar-collapse -->
        </nav>
    </aside><!-- /#left-panel -->

    <!-- Left Panel -->

   

    