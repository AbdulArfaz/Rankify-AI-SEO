import mongoose, { Schema } from 'mongoose';

const issueSchema = new Schema({
    severity: {type:String, enum: ["critical", "warning", "info"], required: true},
    category: { type: String, required: true},
    message: { type: String, required: true},
    recommedation: { type: String, required: true},

}, {_id: false})

const analysisSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    overallScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    categories: {
        seo: {type: Number, default: 0},
        performance: {type: Number, default: 0},
        accessibility: {type: Number, default: 0},
        bestPractices: {type: Number, default: 0}
    },
    metadata: {
        title: {type: String, default: ""},
        description: {type: String, default: ""},
        canonical: {type: String, default: ""},
        robots: {type: String, default: ""},
        ogTitle: {type: String, default: ""},
        ogDescription: {type: String, default: ""},
        ogImage: {type: String, default: ""},
        twitterCard: {type: String, default: ""},
        viewport: {type: String, default: ""},
        charset: {type: String, default: ""},
    },
    headings: {
        h1: {type: NUmber, default: 0},
        h2: {type: NUmber, default: 0},
        h3: {type: NUmber, default: 0},
        h4: {type: NUmber, default: 0},
        h5: {type: NUmber, default: 0},
        h6: {type: NUmber, default: 0},
        h1Texts: [String],
    },
    links: {
        internal: {type: Number, default: 0},
        external: {type: Number, default: 0},
        broken: {type: Number, default: 0},
        total: {type: Number, default: 0},
    },
    images: {
        total: {type: Number, default: 0},
        missingAlt: {type: Number, default: 0},
        withAlt: {type: Number, default: 0},
    },
    keywords: [
        {
            word: String,
            count: Number,
            density: Number,
        },
    ],
    issues: [issueSchema],
    loadTime: {type: Number, default: 0},
    pazeSize:{type: Number, default: 0},
    wordCount:{type: Number, default: 0},
    status: {type: String, enum : ["pending", "processing", "completed", "failed"], default: "Pending"},
}, {timestamps: true})

export const Analysis =
  mongoose.models.Analysis ||
  mongoose.model("Analysis", analysisSchema);