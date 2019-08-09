const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const koaStatic = require('koa-static');
const cors = require('@koa/cors');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const mjml2html = require('mjml');
const nunjucks = require('nunjucks');
const nodemailer = require('nodemailer');


const router = new Router();

router.get('/v1/', (ctx) => {
    ctx.body = {
        version: '0.1.0'
    };
});

router.get('/v1/templates/', (ctx) => {
    ctx.body = fs.readdirSync(ctx.templatePath);
});

router.get('/v1/templates/:name', (ctx) => {
    const schemaJsonPath = path.join(
        ctx.templatePath,
        ctx.params.name,
        'schema.json'
    );
    if (!fs.existsSync(schemaJsonPath)) {
        ctx.status = 404;
        ctx.body = `Template ${ctx.params.name} not exists`;
        return;
    }
    const jsonSchemaStr = fs.readFileSync(
        schemaJsonPath,
        {
            encoding: 'utf8'
        }
    );

    let jsonSchema;

    try {
        jsonSchema = JSON.parse(jsonSchemaStr);
    } catch (e) {
        ctx.status = 500;
        ctx.body = e;
        return;
    }
    ctx.body = {
        json_schema: jsonSchema
    };
});

function getSubject(templatePath, values) {
    return nunjucks.renderString(
        fs.readFileSync(
            templatePath,
            {
                encoding: 'utf8'
            }
        ),
        values
    );
}

function getHtml(templatePath, values) {
    return nunjucks.renderString(
        mjml2html(fs.readFileSync(
            templatePath,
            {
                encoding: 'utf8'
            }
        )).html,
        values
    );
}

function getTxt(templatePath, values) {
    return nunjucks.renderString(
        fs.readFileSync(
            templatePath,
            {
                encoding: 'utf8'
            }
        ),
        values
    );
}

router.post('/v1/templates/:name/preview', (ctx) => {
    const templatePath = path.join(ctx.templatePath, ctx.params.name);

    const subjectTemplatePath = path.join(templatePath, 'default.subject');
    const mjmlTemplatePath = path.join(templatePath, 'default.mjml');
    const txtTemplatePath = path.join(templatePath, 'default.txt');

    const templates = [subjectTemplatePath, mjmlTemplatePath, txtTemplatePath];
    
    for (let i = 0; i < templates.length; i++) {
        if (!fs.existsSync(templates[i])) {
            ctx.status = 404;
            ctx.body = `Template ${templates[i]} not exists`;
            return;
        }
    }

    ctx.type = 'application/json';
    ctx.body = {
        'subject': getSubject(subjectTemplatePath, ctx.request.body),
        'html': getHtml(mjmlTemplatePath, ctx.request.body),
        'txt': getTxt(txtTemplatePath, ctx.request.body)
    };
});

router.post('/v1/templates/:name/send', async (ctx) => {
    const templatePath = path.join(ctx.templatePath, ctx.params.name);

    const subjectTemplatePath = path.join(templatePath, 'default.subject');
    const mjmlTemplatePath = path.join(templatePath, 'default.mjml');
    const txtTemplatePath = path.join(templatePath, 'default.txt');

    const templates = [subjectTemplatePath, mjmlTemplatePath, txtTemplatePath];

    for (let i = 0; i < templates.length; i++) {
        if (!fs.existsSync(templates[i])) {
            ctx.status = 404;
            ctx.body = `Template ${templates[i]} not exists`;
            return;
        }
    }

    const result = await ctx.transporter.sendMail({
        from: ctx.request.body.from,
        to: ctx.request.body.to,
        subject: getSubject(subjectTemplatePath, ctx.request.body),
        html: getHtml(mjmlTemplatePath, ctx.request.body),
        text: getTxt(txtTemplatePath, ctx.request.body)
    });
    ctx.body = { result: result };
});

module.exports = function createApp(port, templatePath, staticPath, smtpUrl) {
    const app = new Koa();
    app.context.port = port;
    app.context.templatePath = templatePath;

    if (smtpUrl === undefined) {
        app.context.transporter = nodemailer.createTransport({
            streamTransport: true,
            newline: 'unix'
        });
    } else {
        app.context.transporter = nodemailer.createTransport(smtpUrl);
        app.context.transporter.verify(function (error) {
            if (error) {
                console.log(error);
                process.exit(1);
            } else {
                console.log('Server is ready to take our messages');
            }
        });
    }

    app.use(bodyParser());
    app.use(cors());
    app.use(router.routes());

    if (staticPath) {
        app.use(koaStatic(staticPath));
    }

    return app;
};
