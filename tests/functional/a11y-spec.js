define(function (require) {
    var registerSuite = require('intern!object'),
        expect = require('intern/chai!expect');

    registerSuite({
        name: 'a11y tests',
        'accessibility developer tools': function () {
            return this.remote
                .get(require.toUrl('good.html'))
                .sleep(1000)
                .execute(function() {
                    var script = document.createElement('script');
                    script.onload = function() {
                        console.log("Script loaded and ready");
                    };
                    script.src = "node_modules/accessibility-developer-tools/dist/js/axs_testing.js";
                    document.getElementsByTagName('head')[0].appendChild(script);
                })
                .sleep(1000)
                .execute(function(){
                    var reports = axs.Audit.run();

                    reports.forEach(function (report){
                        if ( report.result === 'FAIL' ) {
                            report.message = 'a11y failure: ' + report.rule.heading;

                            if ( report.elements !== undefined ) {
                                report.message += '\na11y elements:\n';

                                for (var i = 0; i < report.elements.length; i++) {
                                    var el = report.elements[i];
                                    try {
                                        report.message += axs.utils.getQuerySelectorText(el) + '\n';
                                    } catch (err) {
                                        report.message += ' tag name:' + el.tagName;
                                        report.message += ' id:' + el.id;
                                    }
                                }
                            }
                        }
                    });

                    return reports;
                })
                .then(function(reports){
                    var failure = false;
                    // console.log(reports);
                    reports.forEach(function (report){
                        if (report.result === 'FAIL') {
                            failure = true;
                            console.log(report.message);

                        }
                    });
                    expect(failure).to.equal(false);
                });
        },
        'axe core': function () {
            return this.remote
                .get(require.toUrl('good.html'))
                .sleep(1000)
                .execute(function() {
                    var script = document.createElement('script');
                    script.onload = function() {
                        console.log("Script loaded and ready");
                    };
                    script.src = "node_modules/axe-core/axe.js";
                    document.getElementsByTagName('head')[0].appendChild(script);
                })
                .sleep(1000)
                .execute(function(){

                    axe.a11yCheck(document, function(results) {
                        console.log("a11y:" + JSON.stringify(results) );
                    });

                })
                .sleep(1000)
                .getLogsFor('browser')
                .then(function(logs){
                    logs.forEach(function(log){
                        if (log.message.match(/^a11y:/)) {

                            log.message = log.message.replace(/a11y:| \(:\)/g, '');

                            var a11yMessages = JSON.parse( log.message );

                            a11yMessages.violations.forEach(function( vio ){

                                var message = 'a11y failure: ' + vio.description + '\na11y elements:';
                                vio.nodes.forEach(function(node){
                                    message += '\n' + node.html;
                                });
                                message += '\n';

                                console.log(message);

                            });

                            expect( a11yMessages.violations ).to.be.empty;
                        }
                    });
                });
        }
    });
});

